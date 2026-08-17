/**
 * H-Earth repository registry validator dependency loader v10 successor.
 *
 * Preserves the complete predecessor chain and advances only the active
 * additive facade needed for exact Gen306 world-manifold preflight resolution.
 */

import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-live-experience-maturity-convergence-accepted-occurrences.js';
import {
  verifyHEarthLiveExperienceMaturityConvergenceAcceptedOccurrences
} from './accepted-amendments/h-earth.repository-registry.live-experience-maturity-convergence-accepted-occurrences.js';
import {
  verifyHEarthHC02PageExcellenceExecutionCarrierScopeV2
} from './accepted-amendments/h-earth.repository-registry.hc02-page-excellence-execution-carrier-scope.v2.js';
import {
  verifyHEarthGen305S26PreflightScopeRegistration
} from './accepted-amendments/h-earth.repository-registry.gen305-s26-preflight-scope-registration.js';
import registryFacade, {
  verifyHEarthGen306WorldManifoldPreflightScopeRegistration
} from './accepted-amendments/h-earth.repository-registry.gen306-world-manifold-preflight-scope-registration.js';
import {
  deepFreeze
} from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const acceptedOccurrenceVerification =
    verifyHEarthLiveExperienceMaturityConvergenceAcceptedOccurrences();
  const hc02CarrierScopeVerification =
    verifyHEarthHC02PageExcellenceExecutionCarrierScopeV2();
  const gen305S26ScopeVerification =
    verifyHEarthGen305S26PreflightScopeRegistration();
  const gen306WorldManifoldScopeVerification =
    verifyHEarthGen306WorldManifoldPreflightScopeRegistration();
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
    gen305S26ScopeEligible: gen305S26ScopeVerification.eligible === true,
    gen305S26ExactTwoTargets:
      gen305S26ScopeVerification.checks.exactTwoTargetPaths === true,
    gen305S26TruthfulAbsencePreserved:
      gen305S26ScopeVerification.checks.targetOccurrencesTruthfullyAbsent === true,
    gen305S26PredecessorRendererPreserved:
      gen305S26ScopeVerification.checks.predecessorRendererRegistrationPreserved === true,
    gen305S26PathResolutionOnly:
      gen305S26ScopeVerification.checks.noProductAuthority === true &&
      gen305S26ScopeVerification.checks.noConstructionAuthority === true,
    gen306WorldManifoldScopeEligible:
      gen306WorldManifoldScopeVerification.eligible === true,
    gen306WorldManifoldExactFourTargets:
      gen306WorldManifoldScopeVerification.checks.exactFourTargetPaths === true,
    gen306WorldManifoldTruthfulAbsencePreserved:
      gen306WorldManifoldScopeVerification.checks.targetOccurrencesTruthfullyAbsent === true,
    gen306WorldManifoldPredecessorRun8EPreserved:
      gen306WorldManifoldScopeVerification.checks.predecessorRun8EResolutionPreserved === true,
    gen306WorldManifoldPredecessorRun8BPreserved:
      gen306WorldManifoldScopeVerification.checks.predecessorRun8BResolutionPreserved === true,
    gen306WorldManifoldPathResolutionOnly:
      gen306WorldManifoldScopeVerification.checks.noProductAuthority === true &&
      gen306WorldManifoldScopeVerification.checks.noConstructionAuthorityCreatedByRegistry === true,
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
      'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v10_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      liveExperienceAcceptedOccurrences:
        acceptedOccurrenceVerification.eligible === true,
      hc02PageExcellenceExecutionCarrierScopeV2:
        hc02CarrierScopeVerification.eligible === true,
      gen305S26PreflightScopeRegistration:
        gen305S26ScopeVerification.eligible === true,
      gen306WorldManifoldPreflightScopeRegistration:
        gen306WorldManifoldScopeVerification.eligible === true
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
    gen305S26PreflightScopeVerification:
      gen305S26ScopeVerification,
    gen306WorldManifoldPreflightScopeVerification:
      gen306WorldManifoldScopeVerification,
    gen306WorldManifoldPreflightScopeChecks: deepFreeze(successorChecks),
    boundary: deepFreeze({
      ...base.boundary,
      liveExperienceAcceptedOccurrenceProvenanceOnly: true,
      historicalCandidateReservationPreserved: true,
      hc02PageExcellenceExecutionCarrierPathResolutionOnly: true,
      hc02PageExcellenceExecutionCarrierProductMutationAuthorityCreated: false,
      hc02PageExcellenceExecutionCarrierHC02AdmissionAuthorityCreated: false,
      hc02PageExcellenceExecutionCarrierUnboxingAuthorityCreated: false,
      gen305S26PreflightScopePathResolutionOnly: true,
      gen305S26PreflightScopeProductMutationAuthorityCreated: false,
      gen305S26PreflightScopeConstructionAuthorityCreated: false,
      gen306WorldManifoldPreflightScopePathResolutionOnly: true,
      gen306WorldManifoldPreflightScopeProductMutationAuthorityCreated: false,
      gen306WorldManifoldPreflightScopeConstructionAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      liveExperienceAcceptedOccurrencesLoaded: true,
      historicalCandidateReservationPreserved: true,
      hc02PageExcellenceExecutionCarrierScopeLoaded: true,
      hc02PageExcellenceExecutionCarrierProductMutationAuthorized: false,
      hc02PageExcellenceExecutionCarrierHC02AdmissionAuthorized: false,
      hc02PageExcellenceExecutionCarrierUnboxingAuthorized: false,
      gen305S26PreflightScopeLoaded: true,
      gen305S26ProductMutationAuthorized: false,
      gen305S26ConstructionAuthorizedByRegistryScope: false,
      gen306WorldManifoldPreflightScopeLoaded: true,
      gen306WorldManifoldProductMutationAuthorized: false,
      gen306WorldManifoldConstructionAuthorizedByRegistryScope: false
    })
  });
}

export {
  runHEarthC2R1MC5AutomaticRegistryPreflight
};

export default loadHEarthRepositoryRegistryValidatorDependencies;
