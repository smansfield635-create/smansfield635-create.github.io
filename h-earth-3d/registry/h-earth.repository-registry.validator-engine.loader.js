/**
 * H-Earth repository registry validator dependency loader v23 successor.
 * Preserves the final-cloud compositor recognition chain and adds exact
 * read-only path recognition for the Audralia tablet single-context runtime.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-tablet-single-context-runtime-path-recognition.js';
import registryFacade, {
  verifyHEarthAudraliaTabletSingleContextRuntimePathRecognition
} from './accepted-amendments/h-earth.repository-registry.audralia-tablet-single-context-runtime-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const verification = verifyHEarthAudraliaTabletSingleContextRuntimePathRecognition();
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();

  const successorChecks = {
    predecessorIdentityStatePreserved: base.identityVerified === false,
    predecessorSuccessorIntegrityPreserved: base.successorIntegrityVerified === true,
    exactPathRecognitionEligible: verification.eligible === true,
    exactTargetPathResolved:
      verification.checks.exactTargetPathCount === true &&
      verification.checks.targetPathResolves === true,
    governingOccurrencePresent: verification.checks.governingOccurrencePresent === true,
    exactPathOnly:
      verification.checks.exactPathOnly === true &&
      verification.checks.noPrefixRegistration === true,
    auditOnlyNoAuthorityLeak:
      verification.checks.auditOnly === true &&
      verification.checks.pathResolutionOnly === true &&
      verification.checks.noProductRuntimeAuthority === true &&
      verification.checks.noRendererGpuAuthority === true &&
      verification.checks.noEnrichmentAuthority === true &&
      verification.checks.noPrefixWideAuthority === true &&
      verification.checks.noAnchorWaiverAuthority === true &&
      verification.checks.noPublicationAuthority === true,
    registryIdPreserved: registryInstance.registryId === base.registryInstance.registryId,
    registryVersionPreserved: registryInstance.registryVersion === base.registryInstance.registryVersion,
    schemaIdPreserved: registryInstance.schemaId === base.registryInstance.schemaId,
    schemaVersionPreserved: registryInstance.schemaVersion === base.registryInstance.schemaVersion,
    candidateGitBlobIdentityPreserved: discovery.candidateGitBlobSha === base.discovery.candidateGitBlobSha,
    candidateAcceptanceStatusPreserved: registryInstance.accepted === base.registryInstance.accepted,
    candidateCanonicalStatusPreserved: discovery.canonical === base.discovery.canonical
  };

  const successorIntegrityVerified = Object.values(successorChecks).every(Boolean);

  return deepFreeze({
    ...base,
    loaderId: 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v23_AUDRALIA_TABLET_SINGLE_CONTEXT_RUNTIME_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      audraliaTabletSingleContextRuntimePathRecognition: verification.eligible === true,
      audraliaTabletSingleContextRuntimePathRecognitionSuccessorIntegrity: successorIntegrityVerified
    }),
    identityVerified: base.identityVerified,
    inheritedIdentityPreserved: base.identityVerified === false,
    successorIntegrityVerified,
    audraliaTabletSingleContextRuntimePathRecognitionSuccessorChecks: deepFreeze(successorChecks),
    audraliaTabletSingleContextRuntimePathRecognitionVerification: verification,
    boundary: deepFreeze({
      ...base.boundary,
      audraliaTabletSingleContextRuntimeExactPathRecognitionOnly: true,
      audraliaTabletSingleContextRuntimeProductMutationAuthorityCreated: false,
      audraliaTabletSingleContextRuntimeRendererMutationAuthorityCreated: false,
      audraliaTabletSingleContextRuntimeGpuBudgetMutationAuthorityCreated: false,
      audraliaTabletSingleContextRuntimeEnrichmentMutationAuthorityCreated: false,
      audraliaTabletSingleContextRuntimePrefixWideRegistrationAuthorityCreated: false,
      audraliaTabletSingleContextRuntimeExperienceAnchorWaiverAuthorityCreated: false,
      audraliaTabletSingleContextRuntimePublicationAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      audraliaTabletSingleContextRuntimePathRecognitionLoaded: true,
      audraliaTabletSingleContextRuntimePathRecognitionSuccessorIntegrityVerified: successorIntegrityVerified,
      inheritedIdentityStatePreserved: true,
      audraliaTabletSingleContextRuntimeProductMutationAuthorized: false,
      audraliaTabletSingleContextRuntimeRendererMutationAuthorized: false,
      audraliaTabletSingleContextRuntimeGpuBudgetMutationAuthorized: false,
      audraliaTabletSingleContextRuntimeEnrichmentMutationAuthorized: false,
      audraliaTabletSingleContextRuntimePrefixWideRegistrationAuthorized: false,
      audraliaTabletSingleContextRuntimeExperienceAnchorWaiverAuthorized: false,
      audraliaTabletSingleContextRuntimePublicationAuthorized: false
    })
  });
}

export { runHEarthC2R1MC5AutomaticRegistryPreflight };
export default loadHEarthRepositoryRegistryValidatorDependencies;
