/**
 * H-Earth repository registry validator dependency loader v20 successor.
 * Preserves inherited identity and adds exact Audralia PC1 geography path recognition.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-ow03-experience-anchor-evidence-path-recognition.js';
import { verifyHEarthOW03ExperienceAnchorEvidencePathRecognition } from './accepted-amendments/h-earth.repository-registry.ow03-experience-anchor-evidence-path-recognition.js';
import { verifyHEarthOW04ExactPathRecognition } from './accepted-amendments/h-earth.repository-registry.ow04-exact-path-recognition.js';
import { verifyHEarthOW04ParentPromotionReceiptRecognition } from './accepted-amendments/h-earth.repository-registry.ow04-parent-promotion-receipt-recognition.js';
import { verifyHEarthC3CoastalReconstructionAuthorityRecognition } from './accepted-amendments/h-earth.repository-registry.c3-coastal-reconstruction-authority-recognition.js';
import { verifyHEarthC3D1CoastalPlacementRecognition } from './accepted-amendments/h-earth.repository-registry.c3d1-coastal-placement-recognition.js';
import registryFacade, { verifyHEarthAudraliaPC1GeographyPathRecognition } from './accepted-amendments/h-earth.repository-registry.audralia-pc1-geography-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const ow03Verification = verifyHEarthOW03ExperienceAnchorEvidencePathRecognition();
  const ow04Verification = verifyHEarthOW04ExactPathRecognition();
  const parentPromotionVerification = verifyHEarthOW04ParentPromotionReceiptRecognition();
  const c3Verification = verifyHEarthC3CoastalReconstructionAuthorityRecognition();
  const c3d1Verification = verifyHEarthC3D1CoastalPlacementRecognition();
  const pc1Verification = verifyHEarthAudraliaPC1GeographyPathRecognition();
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();

  const successorChecks = {
    predecessorIdentityStatePreserved: base.identityVerified === false,
    inheritedAwardsPublicFaceStatePreserved: base.identityChecks?.awardsPublicFacePathRecognition === false,
    ow03EvidencePathRecognitionEligible: ow03Verification.eligible === true,
    ow03ExactFourPathsResolved: ow03Verification.checks.exactTargetPathCount === true && ow03Verification.checks.allTargetPathsResolve === true,
    ow03AllFourAbsentAtGoverningMain: ow03Verification.checks.allOccurrencesAbsentAtGoverningMain === true,
    ow03AuditOnlyNoAuthorityLeak: ow03Verification.checks.auditOnly === true && ow03Verification.checks.pathResolutionOnly === true && ow03Verification.checks.noProductAuthority === true && ow03Verification.checks.noEvidenceMutationAuthority === true && ow03Verification.checks.noAnchorWaiverAuthority === true && ow03Verification.checks.noCanonicalAuthority === true,
    ow04ExactPathRecognitionEligible: ow04Verification.eligible === true,
    ow04ExactFourPathsResolved: ow04Verification.checks.exactTargetPathCount === true && ow04Verification.checks.allTargetPathsResolve === true,
    ow04CandidateOccurrencesPresent: ow04Verification.checks.allCandidateOccurrencesPresent === true,
    ow04AuditOnlyNoAuthorityLeak: ow04Verification.checks.auditOnly === true && ow04Verification.checks.pathResolutionOnly === true && ow04Verification.checks.noProductAuthority === true && ow04Verification.checks.noRendererAuthority === true && ow04Verification.checks.noAnchorWaiverAuthority === true,
    parentPromotionReceiptRecognitionEligible: parentPromotionVerification.eligible === true,
    parentPromotionReceiptExactPathResolved: parentPromotionVerification.checks.exactTargetPathCount === true && parentPromotionVerification.checks.targetPathResolves === true,
    parentPromotionAuditOnlyNoAuthorityLeak: parentPromotionVerification.checks.auditOnly === true && parentPromotionVerification.checks.pathResolutionOnly === true && parentPromotionVerification.checks.noProductAuthority === true && parentPromotionVerification.checks.noReceiptMutationAuthority === true && parentPromotionVerification.checks.noAnchorWaiverAuthority === true,
    c3CoastalReconstructionAuthorityRecognitionEligible: c3Verification.eligible === true,
    c3CoastalReconstructionAuthorityExactPathResolved: c3Verification.checks.exactTargetPathCount === true && c3Verification.checks.targetPathResolves === true,
    c3CoastalReconstructionAuthorityAuditOnlyNoAuthorityLeak: c3Verification.checks.auditOnly === true && c3Verification.checks.pathResolutionOnly === true && c3Verification.checks.noProductAuthority === true && c3Verification.checks.noInlandAuthority === true && c3Verification.checks.noAnchorWaiverAuthority === true,
    c3d1CoastalPlacementRecognitionEligible: c3d1Verification.eligible === true,
    c3d1CoastalPlacementExactPathResolved: c3d1Verification.checks.exactTargetPathCount === true && c3d1Verification.checks.targetPathResolves === true,
    c3d1CoastalPlacementAuditOnlyNoAuthorityLeak: c3d1Verification.checks.auditOnly === true && c3d1Verification.checks.pathResolutionOnly === true && c3d1Verification.checks.noProductAuthority === true && c3d1Verification.checks.noInlandAuthority === true && c3d1Verification.checks.noPublicationAuthority === true && c3d1Verification.checks.noAnchorWaiverAuthority === true,
    audraliaPC1GeographyPathRecognitionEligible: pc1Verification.eligible === true,
    audraliaPC1ExactTwoPathsResolved: pc1Verification.checks.exactTargetPathCount === true && pc1Verification.checks.allTargetPathsResolve === true,
    audraliaPC1CandidateOccurrencesPresent: pc1Verification.checks.candidateOccurrencesPresent === true,
    audraliaPC1AuditOnlyNoAuthorityLeak: pc1Verification.checks.auditOnly === true && pc1Verification.checks.pathResolutionOnly === true && pc1Verification.checks.noProductAuthority === true && pc1Verification.checks.noGeographyAuthority === true && pc1Verification.checks.noWeatherCloudAuthority === true && pc1Verification.checks.noPublicationAuthority === true && pc1Verification.checks.noAnchorWaiverAuthority === true,
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
    loaderId: 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v20_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      ow03ExperienceAnchorEvidencePathRecognition: ow03Verification.eligible === true,
      ow04ExactPathRecognition: ow04Verification.eligible === true,
      ow04ParentPromotionReceiptRecognition: parentPromotionVerification.eligible === true,
      c3CoastalReconstructionAuthorityRecognition: c3Verification.eligible === true,
      c3d1CoastalPlacementRecognition: c3d1Verification.eligible === true,
      audraliaPC1GeographyPathRecognition: pc1Verification.eligible === true,
      audraliaPC1GeographyPathRecognitionSuccessorIntegrity: successorIntegrityVerified
    }),
    identityVerified: base.identityVerified,
    inheritedIdentityPreserved: base.identityVerified === false,
    successorIntegrityVerified,
    audraliaPC1GeographyPathRecognitionSuccessorChecks: deepFreeze(successorChecks),
    ow03ExperienceAnchorEvidencePathRecognitionVerification: ow03Verification,
    ow04ExactPathRecognitionVerification: ow04Verification,
    ow04ParentPromotionReceiptRecognitionVerification: parentPromotionVerification,
    c3CoastalReconstructionAuthorityRecognitionVerification: c3Verification,
    c3d1CoastalPlacementRecognitionVerification: c3d1Verification,
    audraliaPC1GeographyPathRecognitionVerification: pc1Verification,
    boundary: deepFreeze({
      ...base.boundary,
      c3CoastalReconstructionAuthorityRecognitionOnly: true,
      c3d1CoastalPlacementRecognitionOnly: true,
      audraliaPC1GeographyPathRecognitionOnly: true,
      audraliaPC1ProductMutationAuthorityCreated: false,
      audraliaPC1GeographyMutationAuthorityCreated: false,
      audraliaPC1WeatherCloudMutationAuthorityCreated: false,
      audraliaPC1PreviewPublicationAuthorityCreated: false,
      audraliaPC1ProductionPublicationAuthorityCreated: false,
      audraliaPC1ExperienceAnchorWaiverAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      c3CoastalReconstructionAuthorityRecognitionLoaded: true,
      c3d1CoastalPlacementRecognitionLoaded: true,
      audraliaPC1GeographyPathRecognitionLoaded: true,
      audraliaPC1GeographyPathRecognitionSuccessorIntegrityVerified: successorIntegrityVerified,
      inheritedIdentityStatePreserved: true,
      audraliaPC1ProductMutationAuthorized: false,
      audraliaPC1GeographyMutationAuthorized: false,
      audraliaPC1WeatherCloudMutationAuthorized: false,
      audraliaPC1PreviewPublicationAuthorized: false,
      audraliaPC1ProductionPublicationAuthorized: false,
      audraliaPC1ExperienceAnchorWaiverAuthorized: false
    })
  });
}

export { runHEarthC2R1MC5AutomaticRegistryPreflight };
export default loadHEarthRepositoryRegistryValidatorDependencies;
