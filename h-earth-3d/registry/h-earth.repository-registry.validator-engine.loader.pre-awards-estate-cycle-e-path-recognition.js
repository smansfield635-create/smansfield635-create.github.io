/**
 * H-Earth repository registry validator dependency loader v24 successor.
 * Preserves the exact v23 Awards Coherence Cycle C successor through a
 * delegated predecessor and adds only exact Awards Trust Cycle D path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-awards-trust-cycle-d-path-recognition.js';
import registryFacade, {
  verifyHEarthAwardsTrustCycleDPathRecognition
} from './accepted-amendments/h-earth.repository-registry.awards-trust-cycle-d-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base=loadBaseDependencies();
  const cycleDVerification=verifyHEarthAwardsTrustCycleDPathRecognition();
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const successorChecks=deepFreeze({
    predecessorLoaderIdentityPreserved:base.loaderId==='H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v23_AWARDS_COHERENCE_CYCLE_C_EXACT_PATH_RECOGNITION_SUCCESSOR',
    predecessorIdentityStatePreserved:base.identityVerified===false,
    predecessorSuccessorIntegrityPreserved:base.successorIntegrityVerified===true,
    cycleDPathRecognitionEligible:cycleDVerification.eligible===true,
    cycleDExactThreePathsResolved:cycleDVerification.checks.exactTargetPathCount===true&&cycleDVerification.checks.allTargetPathsResolve===true,
    cycleDTruthfulAbsentOccurrences:cycleDVerification.checks.allOccurrencesAbsentAtGoverningMain===true,
    cycleDExactPathOnly:cycleDVerification.checks.exactPathOnly===true&&cycleDVerification.checks.noPrefixRegistration===true,
    cycleDAuditOnlyNoAuthorityLeak:cycleDVerification.checks.auditOnly===true&&cycleDVerification.checks.pathResolutionOnly===true&&cycleDVerification.checks.noCycleDMutationAuthority===true&&cycleDVerification.checks.noPreflightWaiverAuthority===true&&cycleDVerification.checks.noPublicationAuthority===true,
    frozenCycleDCandidateBound:cycleDVerification.checks.frozenCandidateBound===true,
    registryIdPreserved:registryInstance.registryId===base.registryInstance.registryId,
    registryVersionPreserved:registryInstance.registryVersion===base.registryInstance.registryVersion,
    schemaIdPreserved:registryInstance.schemaId===base.registryInstance.schemaId,
    schemaVersionPreserved:registryInstance.schemaVersion===base.registryInstance.schemaVersion,
    candidateGitBlobIdentityPreserved:discovery.candidateGitBlobSha===base.discovery.candidateGitBlobSha,
    candidateAcceptanceStatusPreserved:registryInstance.accepted===base.registryInstance.accepted,
    candidateCanonicalStatusPreserved:discovery.canonical===base.discovery.canonical
  });
  const successorIntegrityVerified=Object.values(successorChecks).every(Boolean);
  return deepFreeze({
    ...base,
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v24_AWARDS_TRUST_CYCLE_D_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,registryInstance,discovery,
    identityChecks:deepFreeze({...base.identityChecks,awardsTrustCycleDPathRecognition:cycleDVerification.eligible===true,awardsTrustCycleDPathRecognitionSuccessorIntegrity:successorIntegrityVerified}),
    identityVerified:base.identityVerified,
    inheritedIdentityPreserved:base.identityVerified===false,
    successorIntegrityVerified,
    awardsTrustCycleDPathRecognitionSuccessorChecks:successorChecks,
    awardsTrustCycleDPathRecognitionVerification:cycleDVerification,
    boundary:deepFreeze({...base.boundary,awardsTrustCycleDExactPathRecognitionOnly:true,awardsTrustCycleDProductMutationAuthorityCreated:false,awardsTrustCycleDQualificationMutationAuthorityCreated:false,awardsTrustCycleDPrefixWideRegistrationAuthorityCreated:false,awardsTrustCycleDPreflightWaiverAuthorityCreated:false,awardsTrustCycleDELaterCycleAuthorityCreated:false,awardsTrustCycleDDeploymentPublicationAuthorityCreated:false}),
    stoppingCondition:deepFreeze({...base.stoppingCondition,awardsTrustCycleDPathRecognitionLoaded:true,awardsTrustCycleDPathRecognitionSuccessorIntegrityVerified:successorIntegrityVerified,inheritedIdentityStatePreserved:true,awardsTrustCycleDProductMutationAuthorized:false,awardsTrustCycleDQualificationMutationAuthorized:false,awardsTrustCycleDPrefixWideRegistrationAuthorized:false,awardsTrustCycleDPreflightWaiverAuthorized:false,awardsTrustCycleDELaterCycleActivationAuthorized:false,awardsTrustCycleDDeploymentPublicationAuthorized:false})
  });
}
export {runHEarthC2R1MC5AutomaticRegistryPreflight};
export default loadHEarthRepositoryRegistryValidatorDependencies;
