/**
 * H-Earth repository registry validator dependency loader v6 successor.
 *
 * The v5 loader is preserved byte-for-byte in
 * h-earth.repository-registry.validator-engine.loader.pre-live-experience-maturity-convergence.js.
 * This wrapper delegates all existing loader checks and substitutes only the newest
 * additive registry facade so the admitted HC00 candidate paths can be recognized.
 */

import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-live-experience-maturity-convergence.js';
import registryFacade, {
  verifyHEarthLiveExperienceMaturityConvergenceAuthorizedCandidateScope
} from './accepted-amendments/h-earth.repository-registry.live-experience-maturity-convergence-authorized-candidate-scope.js';
import {
  deepFreeze
} from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const candidateScopeVerification =
    verifyHEarthLiveExperienceMaturityConvergenceAuthorizedCandidateScope();
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();

  const successorChecks = {
    predecessorLoaderIdentityVerified: base.identityVerified === true,
    predecessorExactHeadRegistrationVerified:
      base.exactHeadRegistrationVerified === true,
    predecessorConstructionCandidateScopeVerified:
      base.constructionCandidateScopeVerified === true,
    candidateScopeEligible: candidateScopeVerification.eligible === true,
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
      'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v6_LIVE_EXPERIENCE_CANDIDATE_SCOPE_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      liveExperienceCandidateScope: Object.values(successorChecks).every(Boolean)
    }),
    identityVerified:
      base.identityVerified === true &&
      Object.values(successorChecks).every(Boolean),
    liveExperienceCandidateScopeVerification: candidateScopeVerification,
    liveExperienceCandidateScopeChecks: deepFreeze(successorChecks),
    boundary: deepFreeze({
      ...base.boundary,
      liveExperienceCandidateScopePathResolutionOnly: true,
      liveExperienceCandidateScopeProductMutationAuthorityCreated: false,
      liveExperienceCandidateScopeMergeAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      liveExperienceCandidateScopeLoaded: true,
      liveExperienceCandidateScopeProductMutationAuthorized: false,
      liveExperienceCandidateScopeMergeAuthorized: false
    })
  });
}

export {
  runHEarthC2R1MC5AutomaticRegistryPreflight
};

export default loadHEarthRepositoryRegistryValidatorDependencies;
