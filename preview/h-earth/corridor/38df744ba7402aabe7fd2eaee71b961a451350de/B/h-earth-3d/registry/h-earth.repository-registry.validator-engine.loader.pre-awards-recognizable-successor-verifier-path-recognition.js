/**
 * H-Earth repository registry validator dependency loader v27 successor.
 * Preserves the exact v26 Awards cinematic epilogue successor through a
 * delegated predecessor and adds only exact Awards Shared Carousel Cycle F path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-awards-shared-carousel-cycle-f-path-recognition.js';
import registryFacade, {
  verifyHEarthAwardsSharedCarouselCycleFPathRecognition
} from './accepted-amendments/h-earth.repository-registry.awards-shared-carousel-cycle-f-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base=loadBaseDependencies();
  const cycleFVerification=verifyHEarthAwardsSharedCarouselCycleFPathRecognition();
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const successorChecks=deepFreeze({
    predecessorLoaderIdentityPreserved:base.loaderId==='H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v26_AWARDS_CINEMATIC_EPILOGUE_EXACT_PATH_RECOGNITION_SUCCESSOR',
    predecessorIdentityStatePreserved:base.identityVerified===false,
    predecessorSuccessorIntegrityPreserved:base.successorIntegrityVerified===true,
    cycleFPathRecognitionEligible:cycleFVerification.eligible===true,
    cycleFExactFourPathsResolved:cycleFVerification.checks.exactTargetPathCount===true&&cycleFVerification.checks.allTargetPathsResolve===true,
    cycleFTruthfulAbsentOccurrences:cycleFVerification.checks.allOccurrencesAbsentAtGoverningMain===true,
    cycleFExactPathOnly:cycleFVerification.checks.exactPathOnly===true&&cycleFVerification.checks.noPrefixRegistration===true,
    cycleFAuditOnlyNoAuthorityLeak:cycleFVerification.checks.auditOnly===true&&cycleFVerification.checks.pathResolutionOnly===true&&cycleFVerification.checks.noCycleFMutationAuthority===true&&cycleFVerification.checks.noPreflightWaiverAuthority===true&&cycleFVerification.checks.noPublicationAuthority===true,
    frozenCycleFCandidateBound:cycleFVerification.checks.frozenCandidateBound===true,
    failedPreflightBound:cycleFVerification.checks.failedPreflightBound===true,
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
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v27_AWARDS_SHARED_CAROUSEL_CYCLE_F_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,registryInstance,discovery,
    identityChecks:deepFreeze({...base.identityChecks,awardsSharedCarouselCycleFPathRecognition:cycleFVerification.eligible===true,awardsSharedCarouselCycleFPathRecognitionSuccessorIntegrity:successorIntegrityVerified}),
    identityVerified:base.identityVerified,
    inheritedIdentityPreserved:base.identityVerified===false,
    successorIntegrityVerified,
    awardsSharedCarouselCycleFPathRecognitionSuccessorChecks:successorChecks,
    awardsSharedCarouselCycleFPathRecognitionVerification:cycleFVerification,
    boundary:deepFreeze({...base.boundary,awardsSharedCarouselCycleFExactPathRecognitionOnly:true,awardsSharedCarouselCycleFProductMutationAuthorityCreated:false,awardsSharedCarouselCycleFQualificationMutationAuthorityCreated:false,awardsSharedCarouselCycleFPrefixWideRegistrationAuthorityCreated:false,awardsSharedCarouselCycleFPreflightWaiverAuthorityCreated:false,awardsSharedCarouselCycleFDeploymentPublicationAuthorityCreated:false}),
    stoppingCondition:deepFreeze({...base.stoppingCondition,awardsSharedCarouselCycleFPathRecognitionLoaded:true,awardsSharedCarouselCycleFPathRecognitionSuccessorIntegrityVerified:successorIntegrityVerified,inheritedIdentityStatePreserved:true,awardsSharedCarouselCycleFProductMutationAuthorized:false,awardsSharedCarouselCycleFQualificationMutationAuthorized:false,awardsSharedCarouselCycleFPrefixWideRegistrationAuthorized:false,awardsSharedCarouselCycleFPreflightWaiverAuthorized:false,awardsSharedCarouselCycleFDeploymentPublicationAuthorized:false})
  });
}
export {runHEarthC2R1MC5AutomaticRegistryPreflight};
export default loadHEarthRepositoryRegistryValidatorDependencies;
