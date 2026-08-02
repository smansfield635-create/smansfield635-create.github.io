/** Target 4B-2 · Contract and registry loader. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Composes all prior accepted overlays through the C2-R1 material-only exact-head
// registration. This registration is read-only and creates no product, merge,
// promotion, publication, or self-certification authority.
import registryFacade, {
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE as MATERIAL_ONLY_EXACT_HEAD_NODE,
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE as MATERIAL_ONLY_EXACT_HEAD_EVIDENCE,
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_REGISTRATION as MATERIAL_ONLY_EXACT_HEAD_REGISTRATION
} from './accepted-amendments/h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js';
import {
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_SCOPE_NODE as FINAL_PLACEMENT_NODE,
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_EVIDENCE as FINAL_PLACEMENT_EVIDENCE
} from './accepted-amendments/h-earth.repository-registry.gratitude-region-final-spatial-placement-disposition.js';
import { deepFreeze, H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY } from './h-earth.repository-registry.validator-engine.identity.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const readJson = fileName => JSON.parse(fs.readFileSync(path.join(directory, fileName), 'utf8'));
const FILES = Object.freeze({
  consolidated: 'h-earth.repository-registry.validator-contract.json',
  input: 'h-earth.repository-registry.validator-contract.input.json',
  receipt: 'h-earth.repository-registry.validator-contract.receipt.json',
  dispositions: 'h-earth.repository-registry.validator-contract.dispositions.json',
  failures: 'h-earth.repository-registry.validator-contract.failures.json',
  criticality: 'h-earth.repository-registry.validator-contract.criticality.json',
  algorithm: 'h-earth.repository-registry.validator-contract.algorithm.json',
  instruction: 'h-earth.repository-registry.tool-instruction.json'
});
const MC5_WORKFLOW_PATH = path.resolve(
  directory,
  '../../.github/workflows/h-earth-c2-r1-mc5-exact-head-verification.yml'
);

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const contracts = {
    consolidated: readJson(FILES.consolidated),
    input: readJson(FILES.input),
    receipt: readJson(FILES.receipt),
    dispositions: readJson(FILES.dispositions),
    failures: readJson(FILES.failures),
    criticality: readJson(FILES.criticality),
    algorithm: readJson(FILES.algorithm),
    instruction: readJson(FILES.instruction)
  };
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const expected = H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY;
  const identityChecks = {
    contractId: contracts.consolidated.contractId === expected.contract.contractId,
    contractVersion: contracts.consolidated.contractVersion === expected.contract.contractVersion,
    registryId: registryInstance.registryId === expected.registry.registryId,
    registryVersion: registryInstance.registryVersion === expected.registry.registryVersion,
    schemaId: registryInstance.schemaId === expected.registry.schemaId,
    schemaVersion: registryInstance.schemaVersion === expected.registry.schemaVersion,
    candidateGitBlobSha: discovery.candidateGitBlobSha === expected.registry.candidateGitBlobSha,
    instructionId: contracts.instruction.instructionId === expected.instruction.instructionId,
    instructionVersion: contracts.instruction.instructionVersion === expected.instruction.instructionVersion,
    candidateNotAccepted: registryInstance.accepted === false,
    candidateNotCanonical: discovery.canonical === false
  };
  const finalPlacementChecks = {
    nodeLifecycle: FINAL_PLACEMENT_NODE.lifecycleStatus === 'ACCEPTED_FINAL_PLACEMENT_DISPOSITION',
    evidenceStatus: FINAL_PLACEMENT_EVIDENCE.finalPlacementStatus === 'FINAL_PLACEMENT_DISPOSITION_RESOLVED_PASS_CLOSED',
    areaDispositionCount: FINAL_PLACEMENT_EVIDENCE.validationSummary.areaDispositionCount === 4,
    pairRelationshipCount: FINAL_PLACEMENT_EVIDENCE.validationSummary.pairRelationshipCount === 6,
    preservationLawCount: FINAL_PLACEMENT_EVIDENCE.validationSummary.preservationLawCount === 13,
    zeroUnresolvedRequiredPlacementFields:
      FINAL_PLACEMENT_EVIDENCE.validationSummary.unresolvedRequiredPlacementFieldCount === 0,
    constructionNotAuthorized:
      FINAL_PLACEMENT_NODE.authorityLimitations.includes('NO_AUTOMATIC_CONSTRUCTION_AUTHORITY')
  };

  const runtimePathResolutions = MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.runtimePaths.map((repositoryPath) =>
    registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath)
  );
  const materialOnlyExactHeadChecks = {
    operationId:
      MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.operationId ===
      'H_EARTH_C2_R1_MC5_REGISTRY_WORKFLOW_DEADLOCK_RESOLUTION_001',
    pullRequestNumber: MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.pullRequestNumber === 484,
    candidateBranch:
      MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.candidateBranch ===
      'agent/h-earth-c2-r1-material-only-binding-implementation-001',
    candidateHead:
      MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.candidateHead ===
      '44019e27c3d52c59cc59bba7c833b6317d014273',
    packageIdentity:
      MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.packageIdentity ===
      'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E',
    runtimePathCount: MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.runtimePaths.length === 2,
    runtimePathsResolved:
      runtimePathResolutions.every((resolution) => resolution?.resolved === true),
    runtimeOccurrencesExact:
      runtimePathResolutions.every((resolution, index) =>
        (resolution?.occurrences ?? []).some((occurrence) =>
          occurrence.path === MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.runtimePaths[index] &&
          occurrence.refName === MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.candidateBranch &&
          occurrence.commitSha === MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.candidateHead
        )
      ),
    nodeRegistered:
      registryFacade.getHEarthRepositoryRegistryNode(MATERIAL_ONLY_EXACT_HEAD_NODE.nodeId)?.nodeId ===
      MATERIAL_ONLY_EXACT_HEAD_NODE.nodeId,
    evidenceRegistered:
      registryFacade.getHEarthRepositoryRegistryEvidence(MATERIAL_ONLY_EXACT_HEAD_EVIDENCE.evidenceId)?.evidenceId ===
      MATERIAL_ONLY_EXACT_HEAD_EVIDENCE.evidenceId,
    workflowInstalled: fs.existsSync(MC5_WORKFLOW_PATH),
    productMutationNotAuthorized:
      MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.productMutationAuthorized === false,
    candidateMutationNotAuthorized:
      MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.candidateMutationAuthorized === false,
    materializationRerunNotAuthorized:
      MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.materializationRerunAuthorized === false,
    mergeNotAuthorized: MATERIAL_ONLY_EXACT_HEAD_REGISTRATION.mergeAuthorized === false
  };
  const materialOnlyExactHeadVerified =
    Object.values(materialOnlyExactHeadChecks).every(Boolean);

  return deepFreeze({
    loaderId: 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v2',
    files: FILES,
    contracts,
    registryFacade,
    registryInstance,
    discovery,
    identityChecks,
    identityVerified: Object.values(identityChecks).every(Boolean),
    finalPlacementChecks,
    finalPlacementDispositionVerified: Object.values(finalPlacementChecks).every(Boolean),
    materialOnlyExactHeadRegistration: MATERIAL_ONLY_EXACT_HEAD_REGISTRATION,
    materialOnlyExactHeadChecks,
    materialOnlyExactHeadVerified,
    boundary: {
      readOnly: true,
      networkDependencyRequired: false,
      mutationAuthorityCreated: false,
      workflowEnforcementInstalled: materialOnlyExactHeadChecks.workflowInstalled,
      productMutationAuthorized: false,
      materializationRerunAuthorized: false,
      mergeAuthorityCreated: false
    },
    stoppingCondition: {
      contractAndRegistryLoaderComplete: true,
      finalPlacementDispositionLoaded: true,
      materialOnlyExactHeadRegistrationLoaded: materialOnlyExactHeadVerified,
      constructionAuthorityCreated: false
    }
  });
}

export default loadHEarthRepositoryRegistryValidatorDependencies;
