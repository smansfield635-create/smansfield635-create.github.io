/**
 * H-Earth repository registry validator dependency loader v13 successor.
 *
 * Preserves the complete predecessor chain and adds audit-only path recognition
 * for the four OW01 derivative paths required by automatic pre-mutation preflight.
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
  verifyHEarthHC05LiveGPUPathRecognition
} from './accepted-amendments/h-earth.repository-registry.hc05-live-gpu-path-recognition.js';
import {
  verifyHEarthH1TransitionSurfacePathRecognition
} from './accepted-amendments/h-earth.repository-registry.h1-transition-surface-path-recognition.js';
import {
  verifyHEarthInWorldLiveGPUBindingPathRecognition
} from './accepted-amendments/h-earth.repository-registry.in-world-live-gpu-binding-path-recognition.js';
import {
  verifyHEarthAwardsPublicFacePathRecognition
} from './accepted-amendments/h-earth.repository-registry.awards-public-face-path-recognition.js';
import registryFacade, {
  verifyHEarthOW01DerivativePathRecognition
} from './accepted-amendments/h-earth.repository-registry.ow01-derivative-path-recognition.js';
import {
  deepFreeze
} from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBaseDependencies();
  const acceptedOccurrenceVerification =
    verifyHEarthLiveExperienceMaturityConvergenceAcceptedOccurrences();
  const hc02CarrierScopeVerification =
    verifyHEarthHC02PageExcellenceExecutionCarrierScopeV2();
  const hc05LiveGPUPathRecognitionVerification =
    verifyHEarthHC05LiveGPUPathRecognition();
  const h1TransitionSurfacePathRecognitionVerification =
    verifyHEarthH1TransitionSurfacePathRecognition();
  const inWorldLiveGPUBindingPathRecognitionVerification =
    verifyHEarthInWorldLiveGPUBindingPathRecognition();
  const awardsPublicFacePathRecognitionVerification =
    verifyHEarthAwardsPublicFacePathRecognition();
  const ow01DerivativePathRecognitionVerification =
    verifyHEarthOW01DerivativePathRecognition();
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
    hc05LiveGPUPathRecognitionEligible:
      hc05LiveGPUPathRecognitionVerification.eligible === true,
    hc05ExactTwoRuntimePathsResolved:
      hc05LiveGPUPathRecognitionVerification.checks.exactRuntimePathCount === true &&
      hc05LiveGPUPathRecognitionVerification.checks.allRuntimePathsResolve === true,
    hc05RuntimeBlobCustodyPreserved:
      hc05LiveGPUPathRecognitionVerification.checks.exactR3ABlob === true &&
      hc05LiveGPUPathRecognitionVerification.checks.exactCP2Blob === true,
    hc05AuditOnlyNoAuthorityLeak:
      hc05LiveGPUPathRecognitionVerification.checks.auditOnly === true &&
      hc05LiveGPUPathRecognitionVerification.checks.noProductAuthority === true &&
      hc05LiveGPUPathRecognitionVerification.checks.noRuntimeMutationAuthority === true &&
      hc05LiveGPUPathRecognitionVerification.checks.noRendererAuthority === true,
    h1TransitionSurfacePathRecognitionEligible:
      h1TransitionSurfacePathRecognitionVerification.eligible === true,
    h1ExactThreeTargetPathsResolved:
      h1TransitionSurfacePathRecognitionVerification.checks.exactTargetPathCount === true &&
      h1TransitionSurfacePathRecognitionVerification.checks.allTargetPathsResolve === true,
    h1PointerH0BlobCustodyPreserved:
      h1TransitionSurfacePathRecognitionVerification.checks.exactPointerH0Blob === true,
    h1NewPathAbsenceAtH0Preserved:
      h1TransitionSurfacePathRecognitionVerification.checks.exactTwoNewPathsAbsentAtH0 === true,
    h1AuditOnlyNoAuthorityLeak:
      h1TransitionSurfacePathRecognitionVerification.checks.auditOnly === true &&
      h1TransitionSurfacePathRecognitionVerification.checks.pathResolutionOnly === true &&
      h1TransitionSurfacePathRecognitionVerification.checks.noProductAuthority === true &&
      h1TransitionSurfacePathRecognitionVerification.checks.noCanonicalAuthority === true &&
      h1TransitionSurfacePathRecognitionVerification.checks.noCorrespondenceAuthority === true,
    inWorldLiveGPUBindingPathRecognitionEligible:
      inWorldLiveGPUBindingPathRecognitionVerification.eligible === true,
    inWorldExactTargetPathResolved:
      inWorldLiveGPUBindingPathRecognitionVerification.checks.exactTargetPathCount === true &&
      inWorldLiveGPUBindingPathRecognitionVerification.checks.targetPathResolves === true &&
      inWorldLiveGPUBindingPathRecognitionVerification.checks.targetOccurrenceMatched === true,
    inWorldTargetMainBlobCustodyPreserved:
      inWorldLiveGPUBindingPathRecognitionVerification.checks.exactTargetMainBlob === true,
    inWorldAuditOnlyNoAuthorityLeak:
      inWorldLiveGPUBindingPathRecognitionVerification.checks.auditOnly === true &&
      inWorldLiveGPUBindingPathRecognitionVerification.checks.pathResolutionOnly === true &&
      inWorldLiveGPUBindingPathRecognitionVerification.checks.noProductAuthority === true &&
      inWorldLiveGPUBindingPathRecognitionVerification.checks.noRuntimeAuthority === true &&
      inWorldLiveGPUBindingPathRecognitionVerification.checks.noCanonicalAuthority === true &&
      inWorldLiveGPUBindingPathRecognitionVerification.checks.noCorrespondenceAuthority === true,
    awardsPublicFacePathRecognitionEligible:
      awardsPublicFacePathRecognitionVerification.eligible === true,
    awardsExactTargetPathResolved:
      awardsPublicFacePathRecognitionVerification.checks.exactTargetPathCount === true &&
      awardsPublicFacePathRecognitionVerification.checks.targetPathResolves === true &&
      awardsPublicFacePathRecognitionVerification.checks.targetOccurrenceMatched === true,
    awardsTargetMainBlobCustodyPreserved:
      awardsPublicFacePathRecognitionVerification.checks.exactTargetMainBlob === true,
    awardsAuditOnlyNoAuthorityLeak:
      awardsPublicFacePathRecognitionVerification.checks.auditOnly === true &&
      awardsPublicFacePathRecognitionVerification.checks.pathResolutionOnly === true &&
      awardsPublicFacePathRecognitionVerification.checks.noAwardsMutationAuthority === true &&
      awardsPublicFacePathRecognitionVerification.checks.noAwardOutcomeAuthority === true &&
      awardsPublicFacePathRecognitionVerification.checks.noCanonicalAuthority === true,
    ow01DerivativePathRecognitionEligible:
      ow01DerivativePathRecognitionVerification.eligible === true,
    ow01ExactFourTargetPathsResolved:
      ow01DerivativePathRecognitionVerification.checks.exactTargetPathCount === true &&
      ow01DerivativePathRecognitionVerification.checks.allTargetPathsResolve === true,
    ow01ExistingBlobCustodyPreserved:
      ow01DerivativePathRecognitionVerification.checks.exactLatticeBlob === true &&
      ow01DerivativePathRecognitionVerification.checks.exactZonesBlob === true &&
      ow01DerivativePathRecognitionVerification.checks.exactControllerBlob === true,
    ow01EnvironmentalAudioAbsencePreserved:
      ow01DerivativePathRecognitionVerification.checks.environmentalAudioAbsentAtBaseline === true,
    ow01AuditOnlyNoAuthorityLeak:
      ow01DerivativePathRecognitionVerification.checks.auditOnly === true &&
      ow01DerivativePathRecognitionVerification.checks.pathResolutionOnly === true &&
      ow01DerivativePathRecognitionVerification.checks.noProductAuthority === true &&
      ow01DerivativePathRecognitionVerification.checks.noRuntimeAuthority === true &&
      ow01DerivativePathRecognitionVerification.checks.noCanonicalAuthority === true,
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
      'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v13_OW01_DERIVATIVE_PATH_RECOGNITION_SUCCESSOR',
    registryFacade,
    registryInstance,
    discovery,
    identityChecks: deepFreeze({
      ...base.identityChecks,
      liveExperienceAcceptedOccurrences:
        acceptedOccurrenceVerification.eligible === true,
      hc02PageExcellenceExecutionCarrierScopeV2:
        hc02CarrierScopeVerification.eligible === true,
      hc05LiveGPUPathRecognition:
        hc05LiveGPUPathRecognitionVerification.eligible === true,
      h1TransitionSurfacePathRecognition:
        h1TransitionSurfacePathRecognitionVerification.eligible === true,
      inWorldLiveGPUBindingPathRecognition:
        inWorldLiveGPUBindingPathRecognitionVerification.eligible === true,
      awardsPublicFacePathRecognition:
        awardsPublicFacePathRecognitionVerification.eligible === true,
      ow01DerivativePathRecognition:
        ow01DerivativePathRecognitionVerification.eligible === true
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
    hc02PageExcellenceExecutionCarrierScopeChecks: deepFreeze({
      hc02CarrierScopeEligible: successorChecks.hc02CarrierScopeEligible,
      hc02CarrierPathResolutionOnly: successorChecks.hc02CarrierPathResolutionOnly,
      hc02IndexHtmlPredecessorRegistrationPreserved:
        successorChecks.hc02IndexHtmlPredecessorRegistrationPreserved
    }),
    hc05LiveGPUPathRecognitionVerification,
    hc05LiveGPUPathRecognitionChecks: deepFreeze({
      hc05LiveGPUPathRecognitionEligible:
        successorChecks.hc05LiveGPUPathRecognitionEligible,
      hc05ExactTwoRuntimePathsResolved:
        successorChecks.hc05ExactTwoRuntimePathsResolved,
      hc05RuntimeBlobCustodyPreserved:
        successorChecks.hc05RuntimeBlobCustodyPreserved,
      hc05AuditOnlyNoAuthorityLeak:
        successorChecks.hc05AuditOnlyNoAuthorityLeak
    }),
    h1TransitionSurfacePathRecognitionVerification,
    h1TransitionSurfacePathRecognitionChecks: deepFreeze({
      h1TransitionSurfacePathRecognitionEligible:
        successorChecks.h1TransitionSurfacePathRecognitionEligible,
      h1ExactThreeTargetPathsResolved:
        successorChecks.h1ExactThreeTargetPathsResolved,
      h1PointerH0BlobCustodyPreserved:
        successorChecks.h1PointerH0BlobCustodyPreserved,
      h1NewPathAbsenceAtH0Preserved:
        successorChecks.h1NewPathAbsenceAtH0Preserved,
      h1AuditOnlyNoAuthorityLeak:
        successorChecks.h1AuditOnlyNoAuthorityLeak
    }),
    inWorldLiveGPUBindingPathRecognitionVerification,
    inWorldLiveGPUBindingPathRecognitionChecks: deepFreeze({
      inWorldLiveGPUBindingPathRecognitionEligible:
        successorChecks.inWorldLiveGPUBindingPathRecognitionEligible,
      inWorldExactTargetPathResolved:
        successorChecks.inWorldExactTargetPathResolved,
      inWorldTargetMainBlobCustodyPreserved:
        successorChecks.inWorldTargetMainBlobCustodyPreserved,
      inWorldAuditOnlyNoAuthorityLeak:
        successorChecks.inWorldAuditOnlyNoAuthorityLeak
    }),
    awardsPublicFacePathRecognitionVerification,
    awardsPublicFacePathRecognitionChecks: deepFreeze({
      awardsPublicFacePathRecognitionEligible:
        successorChecks.awardsPublicFacePathRecognitionEligible,
      awardsExactTargetPathResolved:
        successorChecks.awardsExactTargetPathResolved,
      awardsTargetMainBlobCustodyPreserved:
        successorChecks.awardsTargetMainBlobCustodyPreserved,
      awardsAuditOnlyNoAuthorityLeak:
        successorChecks.awardsAuditOnlyNoAuthorityLeak
    }),
    ow01DerivativePathRecognitionVerification,
    ow01DerivativePathRecognitionChecks: deepFreeze({
      ow01DerivativePathRecognitionEligible:
        successorChecks.ow01DerivativePathRecognitionEligible,
      ow01ExactFourTargetPathsResolved:
        successorChecks.ow01ExactFourTargetPathsResolved,
      ow01ExistingBlobCustodyPreserved:
        successorChecks.ow01ExistingBlobCustodyPreserved,
      ow01EnvironmentalAudioAbsencePreserved:
        successorChecks.ow01EnvironmentalAudioAbsencePreserved,
      ow01AuditOnlyNoAuthorityLeak:
        successorChecks.ow01AuditOnlyNoAuthorityLeak
    }),
    boundary: deepFreeze({
      ...base.boundary,
      liveExperienceAcceptedOccurrenceProvenanceOnly: true,
      historicalLiveExperienceCandidateReservationPreserved: true,
      hc02PageExcellenceExecutionCarrierPathResolutionOnly: true,
      hc02PageExcellenceExecutionCarrierProductMutationAuthorityCreated: false,
      hc02PageExcellenceExecutionCarrierHC02AdmissionAuthorityCreated: false,
      hc02PageExcellenceExecutionCarrierUnboxingAuthorityCreated: false,
      hc05LiveGPUPathRecognitionOnly: true,
      hc05ProductMutationAuthorityCreated: false,
      hc05RuntimeMutationAuthorityCreated: false,
      hc05RendererAuthorityCreated: false,
      hc05MergeAuthorityCreated: false,
      h1TransitionSurfacePathRecognitionOnly: true,
      h1ProductMutationAuthorityCreated: false,
      h1RuntimeMutationAuthorityCreated: false,
      h1RendererCameraTerrainGeometryPhysicsMaterialSimulationPersistenceAuthorityCreated: false,
      h1CanonicalIdentityAuthorityCreated: false,
      h1CorrespondenceAuthorityCreated: false,
      h1MergeAuthorityCreated: false,
      inWorldLiveGPUBindingPathRecognitionOnly: true,
      inWorldProductMutationAuthorityCreated: false,
      inWorldRuntimeMutationAuthorityCreated: false,
      inWorldRendererCameraNavigationTerrainGeometryWorldGameplayAuthorityCreated: false,
      inWorldCanonicalIdentityAuthorityCreated: false,
      inWorldCorrespondenceAuthorityCreated: false,
      inWorldMergeDeploymentAuthorityCreated: false,
      awardsPublicFacePathRecognitionOnly: true,
      awardsProductMutationAuthorityCreated: false,
      awardsOutcomeAuthorityCreated: false,
      awardsSemanticCanonicalAuthorityCreated: false,
      awardsHEarthRuntimeRendererTerrainGeometryWorldGameplayAuthorityCreated: false,
      awardsMergeDeploymentPublicationAuthorityCreated: false,
      ow01DerivativePathRecognitionOnly: true,
      ow01TerrainZoneControllerAudioMutationAuthorityCreated: false,
      ow01ProductRuntimeRendererGeometryWorldGameplayAuthorityCreated: false,
      ow01CanonicalIdentityAuthorityCreated: false,
      ow01MergeDeploymentPublicationAuthorityCreated: false
    }),
    stoppingCondition: deepFreeze({
      ...base.stoppingCondition,
      liveExperienceAcceptedOccurrencesLoaded: true,
      historicalLiveExperienceCandidateReservationPreserved: true,
      hc02PageExcellenceExecutionCarrierScopeLoaded: true,
      hc02PageExcellenceExecutionCarrierProductMutationAuthorized: false,
      hc02PageExcellenceExecutionCarrierHC02AdmissionAuthorized: false,
      hc02PageExcellenceExecutionCarrierUnboxingAuthorized: false,
      hc05LiveGPUPathRecognitionLoaded: true,
      hc05LiveGPUProductMutationAuthorized: false,
      hc05LiveGPURuntimeMutationAuthorized: false,
      hc05LiveGPURendererMutationAuthorized: false,
      hc05LiveGPUMergeAuthorized: false,
      h1TransitionSurfacePathRecognitionLoaded: true,
      h1ProductMutationAuthorized: false,
      h1RuntimeMutationAuthorized: false,
      h1CanonicalIdentityAuthorityAuthorized: false,
      h1CorrespondenceAuthorityAuthorized: false,
      h1MergeAuthorized: false,
      inWorldLiveGPUBindingPathRecognitionLoaded: true,
      inWorldProductMutationAuthorized: false,
      inWorldRuntimeMutationAuthorized: false,
      inWorldRendererCameraNavigationTerrainGeometryWorldGameplayAuthorized: false,
      inWorldCanonicalIdentityAuthorityAuthorized: false,
      inWorldCorrespondenceAuthorityAuthorized: false,
      inWorldMergeDeploymentAuthorized: false,
      awardsPublicFacePathRecognitionLoaded: true,
      awardsProductMutationAuthorized: false,
      awardsOutcomeAuthorityAuthorized: false,
      awardsCanonicalIdentityAuthorityAuthorized: false,
      awardsMergeDeploymentPublicationAuthorized: false,
      ow01DerivativePathRecognitionLoaded: true,
      ow01TerrainZoneControllerAudioMutationAuthorized: false,
      ow01ProductRuntimeRendererGeometryWorldGameplayAuthorized: false,
      ow01CanonicalIdentityAuthorityAuthorized: false,
      ow01MergeDeploymentPublicationAuthorized: false
    })
  });
}

export {
  runHEarthC2R1MC5AutomaticRegistryPreflight
};

export default loadHEarthRepositoryRegistryValidatorDependencies;