/**
 * H-Earth repository registry validator dependency loader v23 successor.
 * Preserves the exact v22 predecessor through a byte-identical delegated base
 * and adds only exact Awards Coherence Cycle C candidate-path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-awards-coherence-cycle-c-path-recognition.js';
import registryFacade, {
  verifyHEarthAwardsCoherenceCycleCPathRecognition
} from './accepted-amendments/h-earth.repository-registry.awards-coherence-cycle-c-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const cycleCVerification = verifyHEarthAwardsCoherenceCycleCPathRecognition();
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();

  const successorChecks = deepFreeze({
    predecessorLoaderIdentityPreserved:
      base.loaderId === 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v22_AUDRALIA_FINAL_CLOUD_COMPOSITOR_EXACT_PATH_RECOGNITION_SUCCESSOR',
    predecessorIdentityStatePreserved: base.identityVerified === false,
    predecessorSuccessorIntegrityPreserved: base.successorIntegrityVerified === true,
    cycleCPathRecognitionEligible: cycleCVerification.eligible === true,
    cycleCExactThreePathsResolved:
      cycleCVerification.checks.exactTargetPathCount === true &&
      cycleCVerification.checks.allTargetPathsResolve === true,
    cycleCTruthfulAbsentOccurrences:
      cycleCVerification.checks.allOccurrencesAbsentAtGoverningMain === true,
    cycleCExactPathOnly:
      cycleCVerification.checks.exactPathOnly === true &&
      cycleCVerification.checks.noPrefixRegistration === true,
    cycleCAuditOnlyNoAuthorityLeak:
      cycleCVerification.checks.auditOnly === true &&
      cycleCVerification.checks.pathResolutionOnly === true &&
      cycleCVerification.checks.noCycleCMutationAuthority === true &&
      cycleCVerification.checks.noDiagnosticMutationAuthority === true &&
      cycleCVerification.checks.noLaterCycleAuthority === true &&
      cycleCVerification.checks.noPreflightWaiverAuthority === true &&
      cycleCVerification.checks.noPublicationAuthority === true,
    frozenCycleCCandidateBound: cycleCVerification.checks.frozenCandidateBound === true,
    registryIdPreserved: registryInstance.registryId === base.registryInstance.registryId,
    registryVersionPreserved: registryInstance.registryVersion === base.registryInstance.registryVersion,
    schemaIdPreserved: registryInstance.schemaId === base.registryInstance.schemaId,
    schemaVersionPreserved: registryInstance.schemaVersion === base.registryInstance.schemaVersion,
    candidateGitBlobIdentityPreserved: discovery.candidateGitBlobSha === base.discovery.candidateGitBlobSha,
    candidateAcceptanceStatusPreserved: registryInstance.accepted === base.registryInstance.accepted,
    candidateCanonicalStatusPreserved: discovery.canonical === base.discovery.canonical
  });

  const successorIntegrityVerified = Object.values(successorChecks).every(Boolean);

  return deepFreeze({
    ...base,
    loaderId: 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v23_AWARDS_COHERENCE_CYCLE_C_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      awardsCoherenceCycleCPathRecognition: cycleCVerification.eligible === true,
      awardsCoherenceCycleCPathRecognitionSuccessorIntegrity: successorIntegrityVerified
    }),
    identityVerified: base.identityVerified,
    inheritedIdentityPreserved: base.identityVerified === false,
    successorIntegrityVerified,
    awardsCoherenceCycleCPathRecognitionSuccessorChecks: successorChecks,
    awardsCoherenceCycleCPathRecognitionVerification: cycleCVerification,
    boundary: deepFreeze({
      ...base.boundary,
      awardsCoherenceCycleCExactPathRecognitionOnly: true,
      awardsCoherenceCycleCProductMutationAuthorityCreated: false,
      awardsCoherenceCycleCQualificationMutationAuthorityCreated: false,
      coherenceDiagnosticMutationAuthorityCreated: false,
      awardsCoherenceCycleCPrefixWideRegistrationAuthorityCreated: false,
      awardsCoherenceCycleCPreflightWaiverAuthorityCreated: false,
      awardsCoherenceCycleDLaterCycleAuthorityCreated: false,
      awardsCoherenceCycleCDeploymentPublicationAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      awardsCoherenceCycleCPathRecognitionLoaded: true,
      awardsCoherenceCycleCPathRecognitionSuccessorIntegrityVerified: successorIntegrityVerified,
      inheritedIdentityStatePreserved: true,
      awardsCoherenceCycleCProductMutationAuthorized: false,
      awardsCoherenceCycleCQualificationMutationAuthorized: false,
      coherenceDiagnosticMutationAuthorized: false,
      awardsCoherenceCycleCPrefixWideRegistrationAuthorized: false,
      awardsCoherenceCycleCPreflightWaiverAuthorized: false,
      awardsCoherenceCycleDLaterCycleActivationAuthorized: false,
      awardsCoherenceCycleCDeploymentPublicationAuthorized: false
    })
  });
}

export { runHEarthC2R1MC5AutomaticRegistryPreflight };
export default loadHEarthRepositoryRegistryValidatorDependencies;
