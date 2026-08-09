/**
 * H-Earth repository registry validator dependency loader v7 successor.
 *
 * The v6 live-experience candidate-scope loader is preserved byte-for-byte in
 * h-earth.repository-registry.validator-engine.loader.pre-live-experience-maturity-convergence-accepted-occurrences.js.
 * This wrapper delegates all existing checks and substitutes only the newest
 * additive accepted-occurrence registry facade.
 */

import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-live-experience-maturity-convergence-accepted-occurrences.js';
import registryFacade, {
  verifyHEarthLiveExperienceMaturityConvergenceAcceptedOccurrences
} from './accepted-amendments/h-earth.repository-registry.live-experience-maturity-convergence-accepted-occurrences.js';
import {
  deepFreeze
} from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const acceptedOccurrenceVerification =
    verifyHEarthLiveExperienceMaturityConvergenceAcceptedOccurrences();
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();

  const successorChecks = {
    predecessorLoaderIdentityVerified: base.identityVerified === true,
    predecessorExactHeadRegistrationVerified:
      base.exactHeadRegistrationVerified === true,
    predecessorConstructionCandidateScopeVerified:
      base.constructionCandidateScopeVerified === true,
    predecessorLiveExperienceCandidateScopeEligible:
      base.liveExperienceCandidateScopeVerification?.eligible === true,
    acceptedOccurrencesEligible: acceptedOccurrenceVerification.eligible === true,
    historicalCandidateReservationPreserved:
      acceptedOccurrenceVerification.checks.historicalCandidateReservationEligible === true,
    registryIdPreserved:
      registryInstance.registryId === base.registryInstance.registryId,
    registryVersionPreserved:
      registryInstance.registryVersion === base.registryInstance.registryVersion,
    schemaIdPreserved:
      registryInstance.schemaId === base.registryInstance.schemaId,
    schemaVersionPreserved:
      registryInstance.schemaVersion === base.registryInstance.schemaVersion,
    candidateGitBlobIdentityPreserved:
      discovery.candidateGitBlobSha === base.discovery.candidateGitBlobSha,
    candidateAcceptanceStatusPreserved:
      registryInstance.accepted === base.registryInstance.accepted,
    candidateCanonicalStatusPreserved:
      discovery.canonical === base.discovery.canonical
  };

  return deepFreeze({
    ...base,
    loaderId:
      'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v7_LIVE_EXPERIENCE_ACCEPTED_OCCURRENCE_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      liveExperienceAcceptedOccurrences: Object.values(successorChecks).every(Boolean)
    }),
    identityVerified:
      base.identityVerified === true &&
      Object.values(successorChecks).every(Boolean),
    liveExperienceAcceptedOccurrenceVerification: acceptedOccurrenceVerification,
    liveExperienceAcceptedOccurrenceChecks: deepFreeze(successorChecks),
    boundary: deepFreeze({
      ...base.boundary,
      liveExperienceAcceptedOccurrenceProvenanceOnly: true,
      historicalLiveExperienceCandidateReservationPreserved: true,
      liveExperienceAcceptedOccurrenceProductMutationAuthorityCreated: false,
      liveExperienceAcceptedOccurrenceMergeAuthorityCreated: false,
      liveExperienceAcceptedOccurrenceG1G2AuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      liveExperienceAcceptedOccurrencesLoaded: true,
      historicalLiveExperienceCandidateReservationPreserved: true,
      liveExperienceAcceptedOccurrenceProductMutationAuthorized: false,
      liveExperienceAcceptedOccurrenceMergeAuthorized: false,
      liveExperienceAcceptedOccurrenceG1G2Authorized: false
    })
  });
}

export {
  runHEarthC2R1MC5AutomaticRegistryPreflight
};

export default loadHEarthRepositoryRegistryValidatorDependencies;
