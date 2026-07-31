/** Target 4B-2 · Contract and registry loader. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Composes all prior accepted overlays plus the bounded C2-R1 candidate path
// disposition. The C2-R1 overlay adds read-only path resolution only and does
// not create mutation, merge, renderer, route, deployment, or product authority.
import registryFacade from './accepted-amendments/h-earth.repository-registry.c2-r1-candidate-path-disposition.js';
import {
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_SCOPE_NODE as FINAL_PLACEMENT_NODE,
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_EVIDENCE as FINAL_PLACEMENT_EVIDENCE
} from './accepted-amendments/h-earth.repository-registry.gratitude-region-final-spatial-placement-disposition.js';
import { deepFreeze, H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY } from './h-earth.repository-registry.validator-engine.identity.js';
const directory=path.dirname(fileURLToPath(import.meta.url));
const readJson=fileName=>JSON.parse(fs.readFileSync(path.join(directory,fileName),'utf8'));
const FILES=Object.freeze({consolidated:'h-earth.repository-registry.validator-contract.json',input:'h-earth.repository-registry.validator-contract.input.json',receipt:'h-earth.repository-registry.validator-contract.receipt.json',dispositions:'h-earth.repository-registry.validator-contract.dispositions.json',failures:'h-earth.repository-registry.validator-contract.failures.json',criticality:'h-earth.repository-registry.validator-contract.criticality.json',algorithm:'h-earth.repository-registry.validator-contract.algorithm.json',instruction:'h-earth.repository-registry.tool-instruction.json'});
export function loadHEarthRepositoryRegistryValidatorDependencies(){
  const contracts={consolidated:readJson(FILES.consolidated),input:readJson(FILES.input),receipt:readJson(FILES.receipt),dispositions:readJson(FILES.dispositions),failures:readJson(FILES.failures),criticality:readJson(FILES.criticality),algorithm:readJson(FILES.algorithm),instruction:readJson(FILES.instruction)};
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const expected=H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY;
  const identityChecks={contractId:contracts.consolidated.contractId===expected.contract.contractId,contractVersion:contracts.consolidated.contractVersion===expected.contract.contractVersion,registryId:registryInstance.registryId===expected.registry.registryId,registryVersion:registryInstance.registryVersion===expected.registry.registryVersion,schemaId:registryInstance.schemaId===expected.registry.schemaId,schemaVersion:registryInstance.schemaVersion===expected.registry.schemaVersion,candidateGitBlobSha:discovery.candidateGitBlobSha===expected.registry.candidateGitBlobSha,instructionId:contracts.instruction.instructionId===expected.instruction.instructionId,instructionVersion:contracts.instruction.instructionVersion===expected.instruction.instructionVersion,candidateNotAccepted:registryInstance.accepted===false,candidateNotCanonical:discovery.canonical===false};
  const finalPlacementChecks={nodeLifecycle:FINAL_PLACEMENT_NODE.lifecycleStatus==='ACCEPTED_FINAL_PLACEMENT_DISPOSITION',evidenceStatus:FINAL_PLACEMENT_EVIDENCE.finalPlacementStatus==='FINAL_PLACEMENT_DISPOSITION_RESOLVED_PASS_CLOSED',areaDispositionCount:FINAL_PLACEMENT_EVIDENCE.validationSummary.areaDispositionCount===4,pairRelationshipCount:FINAL_PLACEMENT_EVIDENCE.validationSummary.pairRelationshipCount===6,preservationLawCount:FINAL_PLACEMENT_EVIDENCE.validationSummary.preservationLawCount===13,zeroUnresolvedRequiredPlacementFields:FINAL_PLACEMENT_EVIDENCE.validationSummary.unresolvedRequiredPlacementFieldCount===0,constructionNotAuthorized:FINAL_PLACEMENT_NODE.authorityLimitations.includes('NO_AUTOMATIC_CONSTRUCTION_AUTHORITY')};
  return deepFreeze({loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v1',files:FILES,contracts,registryFacade,registryInstance,discovery,identityChecks,identityVerified:Object.values(identityChecks).every(Boolean),finalPlacementChecks,finalPlacementDispositionVerified:Object.values(finalPlacementChecks).every(Boolean),boundary:{readOnly:true,networkDependencyRequired:false,mutationAuthorityCreated:false,workflowEnforcementInstalled:false},stoppingCondition:{contractAndRegistryLoaderComplete:true,finalPlacementDispositionLoaded:true,constructionAuthorityCreated:false}});
}
export default loadHEarthRepositoryRegistryValidatorDependencies;
