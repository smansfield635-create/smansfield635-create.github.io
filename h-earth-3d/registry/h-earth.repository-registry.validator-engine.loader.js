/**
 * H-Earth repository registry validator dependency loader v28 successor.
 * Preserves the exact v27 Awards Shared Carousel Cycle F successor through a
 * delegated predecessor and adds only exact Awards recognizable-successor verifier path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-awards-recognizable-successor-verifier-path-recognition.js';
import registryFacade, {
  verifyHEarthAwardsRecognizableSuccessorVerifierPathRecognition
} from './accepted-amendments/h-earth.repository-registry.awards-recognizable-successor-verifier-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base=loadBaseDependencies();
  const verification=verifyHEarthAwardsRecognizableSuccessorVerifierPathRecognition();
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const successorChecks=deepFreeze({
    predecessorLoaderIdentityPreserved:base.loaderId==='H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v27_AWARDS_SHARED_CAROUSEL_CYCLE_F_EXACT_PATH_RECOGNITION_SUCCESSOR',
    predecessorIdentityStatePreserved:base.identityVerified===false,
    predecessorSuccessorIntegrityPreserved:base.successorIntegrityVerified===true,
    pathRecognitionEligible:verification.eligible===true,
    exactOnePathResolved:verification.checks.exactTargetPathCount===true&&verification.checks.allTargetPathsResolve===true,
    truthfulAbsentOccurrence:verification.checks.allOccurrencesAbsentAtGoverningMain===true,
    exactPathOnly:verification.checks.exactPathOnly===true&&verification.checks.noPrefixRegistration===true,
    auditOnlyNoAuthorityLeak:verification.checks.auditOnly===true&&verification.checks.pathResolutionOnly===true&&verification.checks.noProductMutationAuthority===true&&verification.checks.noPreflightWaiverAuthority===true&&verification.checks.noPublicationAuthority===true,
    frozenCandidateBound:verification.checks.frozenCandidateBound===true,
    failedPreflightBound:verification.checks.failedPreflightBound===true,
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
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v28_AWARDS_RECOGNIZABLE_SUCCESSOR_VERIFIER_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,registryInstance,discovery,
    identityChecks:deepFreeze({...base.identityChecks,awardsRecognizableSuccessorVerifierPathRecognition:verification.eligible===true,awardsRecognizableSuccessorVerifierPathRecognitionSuccessorIntegrity:successorIntegrityVerified}),
    identityVerified:base.identityVerified,
    inheritedIdentityPreserved:base.identityVerified===false,
    successorIntegrityVerified,
    awardsRecognizableSuccessorVerifierPathRecognitionSuccessorChecks:successorChecks,
    awardsRecognizableSuccessorVerifierPathRecognitionVerification:verification,
    boundary:deepFreeze({...base.boundary,awardsRecognizableSuccessorVerifierExactPathRecognitionOnly:true,awardsRecognizableSuccessorVerifierProductMutationAuthorityCreated:false,awardsRecognizableSuccessorVerifierQualificationMutationAuthorityCreated:false,awardsRecognizableSuccessorVerifierPrefixWideRegistrationAuthorityCreated:false,awardsRecognizableSuccessorVerifierPreflightWaiverAuthorityCreated:false,awardsRecognizableSuccessorVerifierDeploymentPublicationAuthorityCreated:false}),
    stoppingCondition:deepFreeze({...base.stoppingCondition,awardsRecognizableSuccessorVerifierPathRecognitionLoaded:true,awardsRecognizableSuccessorVerifierPathRecognitionSuccessorIntegrityVerified:successorIntegrityVerified,inheritedIdentityStatePreserved:true,awardsRecognizableSuccessorVerifierProductMutationAuthorized:false,awardsRecognizableSuccessorVerifierQualificationMutationAuthorized:false,awardsRecognizableSuccessorVerifierPrefixWideRegistrationAuthorized:false,awardsRecognizableSuccessorVerifierPreflightWaiverAuthorized:false,awardsRecognizableSuccessorVerifierDeploymentPublicationAuthorized:false})
  });
}
export {runHEarthC2R1MC5AutomaticRegistryPreflight};
export default loadHEarthRepositoryRegistryValidatorDependencies;
