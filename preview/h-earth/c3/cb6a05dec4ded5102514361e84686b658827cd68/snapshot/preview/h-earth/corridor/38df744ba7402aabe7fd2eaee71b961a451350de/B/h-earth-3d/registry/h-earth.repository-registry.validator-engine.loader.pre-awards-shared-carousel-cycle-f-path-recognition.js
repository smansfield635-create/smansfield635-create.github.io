/**
 * H-Earth repository registry validator dependency loader v26 successor.
 * Preserves the exact v25 Awards Estate Cycle E successor through a
 * delegated predecessor and adds only exact Awards cinematic epilogue path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-awards-cinematic-epilogue-path-recognition.js';
import registryFacade, {
  verifyHEarthAwardsCinematicEpiloguePathRecognition
} from './accepted-amendments/h-earth.repository-registry.awards-cinematic-epilogue-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base=loadBaseDependencies();
  const epilogueVerification=verifyHEarthAwardsCinematicEpiloguePathRecognition();
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const successorChecks=deepFreeze({
    predecessorLoaderIdentityPreserved:base.loaderId==='H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v25_AWARDS_ESTATE_CYCLE_E_EXACT_PATH_RECOGNITION_SUCCESSOR',
    predecessorIdentityStatePreserved:base.identityVerified===false,
    predecessorSuccessorIntegrityPreserved:base.successorIntegrityVerified===true,
    epiloguePathRecognitionEligible:epilogueVerification.eligible===true,
    epilogueExactSevenPathsResolved:epilogueVerification.checks.exactTargetPathCount===true&&epilogueVerification.checks.allTargetPathsResolve===true,
    epilogueTruthfulAbsentOccurrences:epilogueVerification.checks.allOccurrencesAbsentAtGoverningMain===true,
    epilogueExactPathOnly:epilogueVerification.checks.exactPathOnly===true&&epilogueVerification.checks.noPrefixRegistration===true,
    epilogueAuditOnlyNoAuthorityLeak:epilogueVerification.checks.auditOnly===true&&epilogueVerification.checks.pathResolutionOnly===true&&epilogueVerification.checks.noCinematicMutationAuthority===true&&epilogueVerification.checks.noPreflightWaiverAuthority===true&&epilogueVerification.checks.noPublicationAuthority===true,
    epilogueGoverningMainBound:epilogueVerification.checks.governingMainBound===true,
    epilogueConformLedgerBound:epilogueVerification.checks.conformLedgerBound===true,
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
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v26_AWARDS_CINEMATIC_EPILOGUE_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,registryInstance,discovery,
    identityChecks:deepFreeze({...base.identityChecks,awardsCinematicEpiloguePathRecognition:epilogueVerification.eligible===true,awardsCinematicEpiloguePathRecognitionSuccessorIntegrity:successorIntegrityVerified}),
    identityVerified:base.identityVerified,
    inheritedIdentityPreserved:base.identityVerified===false,
    successorIntegrityVerified,
    awardsCinematicEpiloguePathRecognitionSuccessorChecks:successorChecks,
    awardsCinematicEpiloguePathRecognitionVerification:epilogueVerification,
    boundary:deepFreeze({...base.boundary,awardsCinematicEpilogueExactPathRecognitionOnly:true,awardsCinematicEpilogueProductMutationAuthorityCreated:false,awardsCinematicEpilogueQualificationMutationAuthorityCreated:false,awardsCinematicEpiloguePrefixWideRegistrationAuthorityCreated:false,awardsCinematicEpiloguePreflightWaiverAuthorityCreated:false,awardsCinematicEpilogueDeploymentPublicationAuthorityCreated:false}),
    stoppingCondition:deepFreeze({...base.stoppingCondition,awardsCinematicEpiloguePathRecognitionLoaded:true,awardsCinematicEpiloguePathRecognitionSuccessorIntegrityVerified:successorIntegrityVerified,inheritedIdentityStatePreserved:true,awardsCinematicEpilogueProductMutationAuthorized:false,awardsCinematicEpilogueQualificationMutationAuthorized:false,awardsCinematicEpiloguePrefixWideRegistrationAuthorized:false,awardsCinematicEpiloguePreflightWaiverAuthorized:false,awardsCinematicEpilogueDeploymentPublicationAuthorized:false})
  });
}
export {runHEarthC2R1MC5AutomaticRegistryPreflight};
export default loadHEarthRepositoryRegistryValidatorDependencies;
