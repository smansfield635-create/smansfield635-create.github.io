/**
 * GCR2 administrative exact-four-path loader successor.
 * Byte-identical v33 loader is retained behind a delegated import.
 * No upgrade of the predecessor identityVerified status or governance authority.
 */
import {
  loadHEarthRepositoryRegistryValidatorDependencies as loadBaseDependencies,
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from './h-earth.repository-registry.validator-engine.loader.pre-gcr2-exact-proof-path-recognition.js';
import registryFacade, {
  GCR2_PROOF_PATHS, verifyGCR2ProofPathRecognition
} from './accepted-amendments/h-earth.repository-registry.gcr2-exact-proof-path-recognition.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies(){
  const base=loadBaseDependencies();
  const verification=verifyGCR2ProofPathRecognition();
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const checks=deepFreeze({
    predecessorLoaderIdentityPreserved:base.loaderId==='H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v33_FD05_DIAGNOSTIC_EXACT_PATH_RECOGNITION_SUCCESSOR',
    predecessorSuccessorIntegrityPreserved:base.successorIntegrityVerified===true,
    predecessorIdentityStatePreserved:base.identityVerified===false,
    exactFourPathsRecognized:verification.eligible===true&&GCR2_PROOF_PATHS.length===4,
    occurrenceBaseTruthPreserved:verification.checks.allFourTruthfulAbsentAtGoverningMain===true,
    occurrenceCandidateBlobTruthPreserved:verification.checks.allFourExactCandidateBlobsVerified===true,
    unregisteredSiblingUnresolved:verification.checks.noUnregisteredSiblingRecognition===true,
    predecessorNodeIdentityPreserved:verification.checks.oldRegistryNodesPreserved===true&&verification.checks.oldIdentityPreserved===true,
    auditOnlyNoWaiverOrPublicationAuthority:verification.checks.auditOnly===true&&verification.checks.noProductMutation===true&&verification.checks.noPreflightWaiver===true&&verification.checks.noExperienceAnchorWaiver===true&&verification.checks.noPublicationAuthority===true,
    registryIdPreserved:registryInstance.registryId===base.registryInstance.registryId,
    registryVersionPreserved:registryInstance.registryVersion===base.registryInstance.registryVersion,
    schemaIdPreserved:registryInstance.schemaId===base.registryInstance.schemaId,
    schemaVersionPreserved:registryInstance.schemaVersion===base.registryInstance.schemaVersion,
    candidateStatusPreserved:registryInstance.accepted===base.registryInstance.accepted,
    candidateSourceIdentityPreserved:discovery.candidateGitBlobSha===base.discovery.candidateGitBlobSha
  });
  const successorIntegrityVerified=Object.values(checks).every(Boolean);
  return deepFreeze({
    ...base,
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v34_GCR2_EXACT_FOUR_PROOF_PATH_RECOGNITION_SUCCESSOR',
    predecessorLoaderId:base.loaderId,
    registryFacade,registryInstance,discovery,
    identityChecks:deepFreeze({...base.identityChecks,gcr2ExactProofPathRecognition:verification.eligible===true}),
    identityVerified:base.identityVerified,
    inheritedIdentityPreserved:base.identityVerified===false,
    successorIntegrityVerified,
    gcr2ProofPathVerification:verification,
    gcr2ProofPathSuccessorChecks:checks,
    boundary:deepFreeze({...base.boundary,
      gcr2ExactFourPathResolutionOnly:true,
      gcr2ProductMutationAuthorityCreated:false,
      gcr2SourceEvidenceMutationAuthorityCreated:false,
      gcr2PrefixRegistrationAuthorityCreated:false,
      gcr2PreflightWaiverAuthorityCreated:false,
      gcr2AnchorWaiverAuthorityCreated:false,
      gcr2MergeDeploymentPublicationAuthorityCreated:false}),
    stoppingCondition:deepFreeze({...base.stoppingCondition,
      gcr2ExactFourPathRecognitionLoaded:true,
      gcr2PredecessorIntegrityVerified:successorIntegrityVerified,
      gcr2EvidenceMutationAuthorized:false,
      gcr2ProductMutationAuthorized:false,
      gcr2PublicationAuthorized:false})
  });
}
export {runHEarthC2R1MC5AutomaticRegistryPreflight};
export default loadHEarthRepositoryRegistryValidatorDependencies;
