/**
 * H-Earth repository registry validator dependency loader v25 successor.
 * Preserves the exact v24 Awards Trust Cycle D successor through a
 * delegated predecessor and adds only exact Awards Estate Cycle E path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-awards-estate-cycle-e-path-recognition.js';
import registryFacade, {
  verifyHEarthAwardsEstateCycleEPathRecognition
} from './accepted-amendments/h-earth.repository-registry.awards-estate-cycle-e-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base=loadBaseDependencies();
  const cycleEVerification=verifyHEarthAwardsEstateCycleEPathRecognition();
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const successorChecks=deepFreeze({
    predecessorLoaderIdentityPreserved:base.loaderId==='H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v24_AWARDS_TRUST_CYCLE_D_EXACT_PATH_RECOGNITION_SUCCESSOR',
    predecessorIdentityStatePreserved:base.identityVerified===false,
    predecessorSuccessorIntegrityPreserved:base.successorIntegrityVerified===true,
    cycleEPathRecognitionEligible:cycleEVerification.eligible===true,
    cycleEExactThreePathsResolved:cycleEVerification.checks.exactTargetPathCount===true&&cycleEVerification.checks.allTargetPathsResolve===true,
    cycleETruthfulAbsentOccurrences:cycleEVerification.checks.allOccurrencesAbsentAtGoverningMain===true,
    cycleEExactPathOnly:cycleEVerification.checks.exactPathOnly===true&&cycleEVerification.checks.noPrefixRegistration===true,
    cycleEAuditOnlyNoAuthorityLeak:cycleEVerification.checks.auditOnly===true&&cycleEVerification.checks.pathResolutionOnly===true&&cycleEVerification.checks.noCycleEMutationAuthority===true&&cycleEVerification.checks.noPreflightWaiverAuthority===true&&cycleEVerification.checks.noPublicationAuthority===true,
    frozenCycleECandidateBound:cycleEVerification.checks.frozenCandidateBound===true,
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
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v25_AWARDS_ESTATE_CYCLE_E_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,registryInstance,discovery,
    identityChecks:deepFreeze({...base.identityChecks,awardsEstateCycleEPathRecognition:cycleEVerification.eligible===true,awardsEstateCycleEPathRecognitionSuccessorIntegrity:successorIntegrityVerified}),
    identityVerified:base.identityVerified,
    inheritedIdentityPreserved:base.identityVerified===false,
    successorIntegrityVerified,
    awardsEstateCycleEPathRecognitionSuccessorChecks:successorChecks,
    awardsEstateCycleEPathRecognitionVerification:cycleEVerification,
    boundary:deepFreeze({...base.boundary,awardsEstateCycleEExactPathRecognitionOnly:true,awardsEstateCycleEProductMutationAuthorityCreated:false,awardsEstateCycleEQualificationMutationAuthorityCreated:false,awardsEstateCycleEPrefixWideRegistrationAuthorityCreated:false,awardsEstateCycleEPreflightWaiverAuthorityCreated:false,awardsEstateCycleEFLaterCycleAuthorityCreated:false,awardsEstateCycleEDeploymentPublicationAuthorityCreated:false}),
    stoppingCondition:deepFreeze({...base.stoppingCondition,awardsEstateCycleEPathRecognitionLoaded:true,awardsEstateCycleEPathRecognitionSuccessorIntegrityVerified:successorIntegrityVerified,inheritedIdentityStatePreserved:true,awardsEstateCycleEProductMutationAuthorized:false,awardsEstateCycleEQualificationMutationAuthorized:false,awardsEstateCycleEPrefixWideRegistrationAuthorized:false,awardsEstateCycleEPreflightWaiverAuthorized:false,awardsEstateCycleEFLaterCycleActivationAuthorized:false,awardsEstateCycleEDeploymentPublicationAuthorized:false})
  });
}
export {runHEarthC2R1MC5AutomaticRegistryPreflight};
export default loadHEarthRepositoryRegistryValidatorDependencies;
