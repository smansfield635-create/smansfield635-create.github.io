/**
 * H-Earth repository registry validator dependency loader v8 successor.
 *
 * Preserves the complete predecessor chain and advances only the active
 * additive facade needed for HC02 Page Excellence V2 execution-carrier and
 * presentation-host path resolution.
 */

import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-live-experience-maturity-convergence-accepted-occurrences.js';
import {
  verifyHEarthLiveExperienceMaturityConvergenceAcceptedOccurrences
} from './accepted-amendments/h-earth.repository-registry.live-experience-maturity-convergence-accepted-occurrences.js';
import registryFacade, {
  verifyHEarthHC02PageExcellenceExecutionCarrierScopeV2
} from './accepted-amendments/h-earth.repository-registry.hc02-page-excellence-execution-carrier-scope.v2.js';
import {
  deepFreeze
} from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const acceptedOccurrenceVerification =
    verifyHEarthLiveExperienceMaturityConvergenceAcceptedOccurrences();
  const hc02CarrierScopeVerification =
    verifyHEarthHC02PageExcellenceExecutionCarrierScopeV2();
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
    hc02CarrierScopeEligible: hc02CarrierScopeVerification.eligible === true,
    hc02CarrierPathResolutionOnly:
      hc02CarrierScopeVerification.checks.noProductAuthority === true &&
      hc02CarrierScopeVerification.checks.noHC02AdmissionAuthority === true &&
      hc02CarrierScopeVerification.checks.noUnboxingAuthority === true,
    hc02IndexHtmlPredecessorRegistrationPreserved:
      hc02CarrierScopeVerification.checks.indexHtmlPredecessorRegistrationPreserved === true,
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
      'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v8_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_V2_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      liveExperienceAcceptedOccurrences:
        acceptedOccurrenceVerification.eligible === true,
      hc02PageExcellenceExecutionCarrierScopeV2:
        hc02CarrierScopeVerification.eligible === true
    }),
    identityVerified:
      base.identityVerified === true &&
      Object.values(successorChecks).every(Boolean),
    liveExperienceAcceptedOccurrenceVerification: acceptedOccurrenceVerification,
    liveExperienceAcceptedOccurrenceChecks: deepFreeze({
      historicalCandidateReservationPreserved:
        successorChecks.historicalCandidateReservationPreserved,
      acceptedOccurrencesEligible:
        successorChecks.acceptedOccurrencesEligible
    }),
    hc02PageExcellenceExecutionCarrierScopeVerification:
      hc02CarrierScopeVerification,
    hc02PageExcellenceExecutionCarrierScopeChecks: deepFreeze(successorChecks),
    boundary: deepFreeze({
      ...base.boundary,
      liveExperienceAcceptedOccurrenceProvenanceOnly: true,
      historicalLiveExperienceCandidateReservationPreserved: true,
      hc02PageExcellenceExecutionCarrierPathResolutionOnly: true,
      hc02PageExcellenceExecutionCarrierProductMutationAuthorityCreated: false,
      hc02PageExcellenceExecutionCarrierHC02AdmissionAuthorityCreated: false,
      hc02PageExcellenceExecutionCarrierUnboxingAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      liveExperienceAcceptedOccurrencesLoaded: true,
      historicalLiveExperienceCandidateReservationPreserved: true,
      hc02PageExcellenceExecutionCarrierScopeLoaded: true,
      hc02PageExcellenceExecutionCarrierProductMutationAuthorized: false,
      hc02PageExcellenceExecutionCarrierHC02AdmissionAuthorized: false,
      hc02PageExcellenceExecutionCarrierUnboxingAuthorized: false
    })
  });
}

export {
  runHEarthC2R1MC5AutomaticRegistryPreflight
};

export default loadHEarthRepositoryRegistryValidatorDependencies;
