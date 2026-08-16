/**
 * H-Earth repository registry validator dependency loader v16 successor.
 *
 * Preserves the complete pre-OW03 predecessor loader behind delegation,
 * preserves OW03 Experience Anchor path recognition, and adds only the exact
 * OW04 governed-path recognition required by the reciprocal preflight repair.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-ow03-experience-anchor-evidence-path-recognition.js';
import {
  verifyHEarthOW03ExperienceAnchorEvidencePathRecognition
} from './accepted-amendments/h-earth.repository-registry.ow03-experience-anchor-evidence-path-recognition.js';
import registryFacade from './accepted-amendments/h-earth.repository-registry.ow04-exact-path-recognition.facade.js';
import {
  verifyHEarthOW04ExactPathRecognition
} from './accepted-amendments/h-earth.repository-registry.ow04-exact-path-recognition.js';
import {
  deepFreeze
} from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const ow03Verification = verifyHEarthOW03ExperienceAnchorEvidencePathRecognition();
  const ow04Verification = verifyHEarthOW04ExactPathRecognition();
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();

  const successorChecks = {
    predecessorLoaderIdentityVerified: base.identityVerified === true,
    ow03EvidencePathRecognitionEligible: ow03Verification.eligible === true,
    ow03ExactFourPathsResolved:
      ow03Verification.checks.exactTargetPathCount === true &&
      ow03Verification.checks.allTargetPathsResolve === true,
    ow03AllFourAbsentAtGoverningMain:
      ow03Verification.checks.allOccurrencesAbsentAtGoverningMain === true,
    ow03AuditOnlyNoAuthorityLeak:
      ow03Verification.checks.auditOnly === true &&
      ow03Verification.checks.pathResolutionOnly === true &&
      ow03Verification.checks.noProductAuthority === true &&
      ow03Verification.checks.noEvidenceMutationAuthority === true &&
      ow03Verification.checks.noAnchorWaiverAuthority === true &&
      ow03Verification.checks.noCanonicalAuthority === true,
    ow04ExactPathRecognitionEligible: ow04Verification.eligible === true,
    ow04ExactFourPathsResolved:
      ow04Verification.checks.exactTargetPathCount === true &&
      ow04Verification.checks.allTargetPathsResolve === true,
    ow04CandidateOccurrencesPresent:
      ow04Verification.checks.allCandidateOccurrencesPresent === true,
    ow04AuditOnlyNoAuthorityLeak:
      ow04Verification.checks.auditOnly === true &&
      ow04Verification.checks.pathResolutionOnly === true &&
      ow04Verification.checks.noProductAuthority === true &&
      ow04Verification.checks.noRendererAuthority === true &&
      ow04Verification.checks.noAnchorWaiverAuthority === true,
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
      'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v16_OW04_EXACT_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      ow03ExperienceAnchorEvidencePathRecognition:
        ow03Verification.eligible === true,
      ow04ExactPathRecognition:
        ow04Verification.eligible === true
    }),
    identityVerified:
      base.identityVerified === true &&
      Object.values(successorChecks).every(Boolean),
    ow03ExperienceAnchorEvidencePathRecognitionVerification: ow03Verification,
    ow04ExactPathRecognitionVerification: ow04Verification,
    ow04ExactPathRecognitionChecks: deepFreeze({
      eligible: successorChecks.ow04ExactPathRecognitionEligible,
      exactFourPathsResolved: successorChecks.ow04ExactFourPathsResolved,
      candidateOccurrencesPresent: successorChecks.ow04CandidateOccurrencesPresent,
      auditOnlyNoAuthorityLeak: successorChecks.ow04AuditOnlyNoAuthorityLeak
    }),
    boundary: deepFreeze({
      ...base.boundary,
      ow04ExactPathRecognitionOnly: true,
      ow04ProductMutationAuthorityCreated: false,
      ow04TerrainMutationAuthorityCreated: false,
      ow04RendererMutationAuthorityCreated: false,
      ow04EvidenceMutationAuthorityCreated: false,
      ow04ReceiptMutationAuthorityCreated: false,
      ow04ExperienceAnchorWaiverAuthorityCreated: false,
      ow04CanonicalIdentityAuthorityCreated: false,
      ow04MergeDeploymentPublicationAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      ow04ExactPathRecognitionLoaded: true,
      ow04ProductMutationAuthorized: false,
      ow04TerrainMutationAuthorized: false,
      ow04RendererMutationAuthorized: false,
      ow04EvidenceMutationAuthorized: false,
      ow04ReceiptMutationAuthorized: false,
      ow04ExperienceAnchorWaiverAuthorized: false,
      ow04CanonicalIdentityAuthorityAuthorized: false,
      ow04MergeDeploymentPublicationAuthorized: false
    })
  });
}

export {
  runHEarthC2R1MC5AutomaticRegistryPreflight
};

export default loadHEarthRepositoryRegistryValidatorDependencies;
