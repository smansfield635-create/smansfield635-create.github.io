/**
 * H-Earth repository registry validator dependency loader v29 successor.
 * Preserves the exact v27 Awards Shared Carousel Cycle F successor through a
 * delegated predecessor and preserves the Awards recognition successor and adds only Audralia tablet cloud-pass exact-path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-awards-recognizable-successor-verifier-path-recognition.js';
import {verifyHEarthAwardsRecognizableSuccessorVerifierPathRecognition} from './accepted-amendments/h-earth.repository-registry.awards-recognizable-successor-verifier-path-recognition.js';
import registryFacade,{verifyHEarthAudraliaTabletCloudPassPathRecognition} from './accepted-amendments/h-earth.repository-registry.audralia-tablet-cloud-pass-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base=loadBaseDependencies();
  const awardsVerification=verifyHEarthAwardsRecognizableSuccessorVerifierPathRecognition();
  const pathRecognitionVerification=verifyHEarthAudraliaTabletCloudPassPathRecognition();
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const successorChecks=deepFreeze({
    predecessorLoaderIdentityPreserved:base.loaderId==='H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v27_AWARDS_SHARED_CAROUSEL_CYCLE_F_EXACT_PATH_RECOGNITION_SUCCESSOR',
    predecessorIdentityStatePreserved:base.identityVerified===false,
    predecessorSuccessorIntegrityPreserved:base.successorIntegrityVerified===true,
    pathRecognitionEligible:awardsVerification.eligible===true,
    exactOnePathResolved:awardsVerification.checks.exactTargetPathCount===true&&awardsVerification.checks.allTargetPathsResolve===true,
    truthfulAbsentOccurrence:awardsVerification.checks.allOccurrencesAbsentAtGoverningMain===true,
    exactPathOnly:awardsVerification.checks.exactPathOnly===true&&awardsVerification.checks.noPrefixRegistration===true,
    auditOnlyNoAuthorityLeak:awardsVerification.checks.auditOnly===true&&awardsVerification.checks.pathResolutionOnly===true&&awardsVerification.checks.noProductMutationAuthority===true&&awardsVerification.checks.noPreflightWaiverAuthority===true&&awardsVerification.checks.noPublicationAuthority===true,
    frozenCandidateBound:awardsVerification.checks.frozenCandidateBound===true,
    failedPreflightBound:awardsVerification.checks.failedPreflightBound===true,
    tabletCloudPassPathRecognitionEligible:pathRecognitionVerification.eligible===true,
    tabletCloudPassExactPathResolved:pathRecognitionVerification.checks.exactTargetPathCount===true&&pathRecognitionVerification.checks.targetPathResolves===true,
    tabletCloudPassOccurrenceBound:pathRecognitionVerification.checks.governingOccurrencePresent===true,
    tabletCloudPassNoAuthorityLeak:pathRecognitionVerification.checks.auditOnly===true&&pathRecognitionVerification.checks.pathResolutionOnly===true&&pathRecognitionVerification.checks.noProductRuntimeAuthority===true&&pathRecognitionVerification.checks.noGenerationExpansion===true&&pathRecognitionVerification.checks.noPreflightWaiver===true&&pathRecognitionVerification.checks.noPublicationAuthority===true,
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
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v29_AUDRALIA_TABLET_CLOUD_PASS_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,registryInstance,discovery,
    identityChecks:deepFreeze({...base.identityChecks,awardsRecognizableSuccessorVerifierPathRecognition:awardsVerification.eligible===true,audraliaTabletCloudPassPathRecognition:pathRecognitionVerification.eligible===true,awardsRecognizableSuccessorVerifierPathRecognitionSuccessorIntegrity:successorIntegrityVerified}),
    identityVerified:base.identityVerified,
    inheritedIdentityPreserved:base.identityVerified===false,
    successorIntegrityVerified,
    awardsRecognizableSuccessorVerifierPathRecognitionSuccessorChecks:successorChecks,
    awardsRecognizableSuccessorVerifierPathRecognitionVerification:awardsVerification,
    audraliaTabletCloudPassPathRecognitionVerification:pathRecognitionVerification,
    boundary:deepFreeze({...base.boundary,audraliaTabletCloudPassExactPathRecognitionOnly:true,audraliaTabletCloudPassProductMutationAuthorityCreated:false,audraliaTabletCloudPassGeneration2161Expanded:false,
    awardsRecognizableSuccessorVerifierExactPathRecognitionOnly:true,awardsRecognizableSuccessorVerifierProductMutationAuthorityCreated:false,awardsRecognizableSuccessorVerifierQualificationMutationAuthorityCreated:false,awardsRecognizableSuccessorVerifierPrefixWideRegistrationAuthorityCreated:false,awardsRecognizableSuccessorVerifierPreflightWaiverAuthorityCreated:false,awardsRecognizableSuccessorVerifierDeploymentPublicationAuthorityCreated:false}),
    stoppingCondition:deepFreeze({...base.stoppingCondition,audraliaTabletCloudPassPathRecognitionLoaded:true,audraliaTabletCloudPassPathRecognitionSuccessorIntegrityVerified:successorIntegrityVerified,audraliaTabletCloudPassProductMutationAuthorized:false,audraliaTabletCloudPassGeneration2161ExpansionAuthorized:false,
    awardsRecognizableSuccessorVerifierPathRecognitionLoaded:true,awardsRecognizableSuccessorVerifierPathRecognitionSuccessorIntegrityVerified:successorIntegrityVerified,inheritedIdentityStatePreserved:true,awardsRecognizableSuccessorVerifierProductMutationAuthorized:false,awardsRecognizableSuccessorVerifierQualificationMutationAuthorized:false,awardsRecognizableSuccessorVerifierPrefixWideRegistrationAuthorized:false,awardsRecognizableSuccessorVerifierPreflightWaiverAuthorized:false,awardsRecognizableSuccessorVerifierDeploymentPublicationAuthorized:false})
  });
}
export {runHEarthC2R1MC5AutomaticRegistryPreflight};
export default loadHEarthRepositoryRegistryValidatorDependencies;
