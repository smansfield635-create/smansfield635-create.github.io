/**
 * H-Earth repository registry validator dependency loader v15 successor.
 *
 * Preserves the complete v14 predecessor loader byte-for-byte behind a delegated
 * base path and adds only OW03 Experience Anchor evidence-path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-ow03-experience-anchor-evidence-path-recognition.js';
import registryFacade, {
  verifyHEarthOW03ExperienceAnchorEvidencePathRecognition
} from './accepted-amendments/h-earth.repository-registry.ow03-experience-anchor-evidence-path-recognition.js';
import {
  deepFreeze
} from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const ow03Verification = verifyHEarthOW03ExperienceAnchorEvidencePathRecognition();
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
      'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v15_OW03_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      ow03ExperienceAnchorEvidencePathRecognition:
        ow03Verification.eligible === true
    }),
    identityVerified:
      base.identityVerified === true &&
      Object.values(successorChecks).every(Boolean),
    ow03ExperienceAnchorEvidencePathRecognitionVerification: ow03Verification,
    ow03ExperienceAnchorEvidencePathRecognitionChecks: deepFreeze({
      eligible: successorChecks.ow03EvidencePathRecognitionEligible,
      exactFourPathsResolved: successorChecks.ow03ExactFourPathsResolved,
      allFourAbsentAtGoverningMain: successorChecks.ow03AllFourAbsentAtGoverningMain,
      auditOnlyNoAuthorityLeak: successorChecks.ow03AuditOnlyNoAuthorityLeak
    }),
    boundary: deepFreeze({
      ...base.boundary,
      ow03ExperienceAnchorEvidencePathRecognitionOnly: true,
      ow03ProductMutationAuthorityCreated: false,
      ow03TerrainMutationAuthorityCreated: false,
      ow03EvidenceMutationAuthorityCreated: false,
      ow03ReceiptMutationAuthorityCreated: false,
      ow03ExperienceAnchorWaiverAuthorityCreated: false,
      ow03CanonicalIdentityAuthorityCreated: false,
      ow03MergeDeploymentPublicationAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      ow03ExperienceAnchorEvidencePathRecognitionLoaded: true,
      ow03ProductMutationAuthorized: false,
      ow03TerrainMutationAuthorized: false,
      ow03EvidenceMutationAuthorized: false,
      ow03ReceiptMutationAuthorized: false,
      ow03ExperienceAnchorWaiverAuthorized: false,
      ow03CanonicalIdentityAuthorityAuthorized: false,
      ow03MergeDeploymentPublicationAuthorized: false
    })
  });
}

export {
  runHEarthC2R1MC5AutomaticRegistryPreflight
};

export default loadHEarthRepositoryRegistryValidatorDependencies;
