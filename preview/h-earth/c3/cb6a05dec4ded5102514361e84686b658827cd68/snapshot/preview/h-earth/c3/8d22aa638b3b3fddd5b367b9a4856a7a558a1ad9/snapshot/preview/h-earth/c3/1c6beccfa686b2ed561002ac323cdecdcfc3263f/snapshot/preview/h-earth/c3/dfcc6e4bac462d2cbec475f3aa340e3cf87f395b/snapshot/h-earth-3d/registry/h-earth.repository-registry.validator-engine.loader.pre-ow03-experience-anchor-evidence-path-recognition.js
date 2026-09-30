/**
 * H-Earth repository registry validator dependency loader v14 successor.
 *
 * Preserves the complete v13 predecessor loader byte-for-byte behind a delegated
 * base path and adds only OW02 Experience Anchor evidence-path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-ow02-experience-anchor-evidence-path-recognition.js';
import registryFacade, {
  verifyHEarthOW02ExperienceAnchorEvidencePathRecognition
} from './accepted-amendments/h-earth.repository-registry.ow02-experience-anchor-evidence-path-recognition.js';
import {
  deepFreeze
} from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const ow02Verification = verifyHEarthOW02ExperienceAnchorEvidencePathRecognition();
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();

  const successorChecks = {
    predecessorLoaderIdentityVerified: base.identityVerified === true,
    ow02EvidencePathRecognitionEligible: ow02Verification.eligible === true,
    ow02ExactFivePathsResolved:
      ow02Verification.checks.exactTargetPathCount === true &&
      ow02Verification.checks.allTargetPathsResolve === true,
    ow02AllFiveAbsentAtGoverningMain:
      ow02Verification.checks.allOccurrencesAbsentAtGoverningMain === true,
    ow02AuditOnlyNoAuthorityLeak:
      ow02Verification.checks.auditOnly === true &&
      ow02Verification.checks.pathResolutionOnly === true &&
      ow02Verification.checks.noProductAuthority === true &&
      ow02Verification.checks.noEvidenceMutationAuthority === true &&
      ow02Verification.checks.noAnchorWaiverAuthority === true &&
      ow02Verification.checks.noCanonicalAuthority === true,
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
      'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v14_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      ow02ExperienceAnchorEvidencePathRecognition:
        ow02Verification.eligible === true
    }),
    identityVerified:
      base.identityVerified === true &&
      Object.values(successorChecks).every(Boolean),
    ow02ExperienceAnchorEvidencePathRecognitionVerification: ow02Verification,
    ow02ExperienceAnchorEvidencePathRecognitionChecks: deepFreeze({
      eligible: successorChecks.ow02EvidencePathRecognitionEligible,
      exactFivePathsResolved: successorChecks.ow02ExactFivePathsResolved,
      allFiveAbsentAtGoverningMain: successorChecks.ow02AllFiveAbsentAtGoverningMain,
      auditOnlyNoAuthorityLeak: successorChecks.ow02AuditOnlyNoAuthorityLeak
    }),
    boundary: deepFreeze({
      ...base.boundary,
      ow02ExperienceAnchorEvidencePathRecognitionOnly: true,
      ow02ProductMutationAuthorityCreated: false,
      ow02TerrainMutationAuthorityCreated: false,
      ow02EvidenceMutationAuthorityCreated: false,
      ow02ReceiptMutationAuthorityCreated: false,
      ow02ExperienceAnchorWaiverAuthorityCreated: false,
      ow02CanonicalIdentityAuthorityCreated: false,
      ow02MergeDeploymentPublicationAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      ow02ExperienceAnchorEvidencePathRecognitionLoaded: true,
      ow02ProductMutationAuthorized: false,
      ow02TerrainMutationAuthorized: false,
      ow02EvidenceMutationAuthorized: false,
      ow02ReceiptMutationAuthorized: false,
      ow02ExperienceAnchorWaiverAuthorized: false,
      ow02CanonicalIdentityAuthorityAuthorized: false,
      ow02MergeDeploymentPublicationAuthorized: false
    })
  });
}

export {
  runHEarthC2R1MC5AutomaticRegistryPreflight
};

export default loadHEarthRepositoryRegistryValidatorDependencies;
