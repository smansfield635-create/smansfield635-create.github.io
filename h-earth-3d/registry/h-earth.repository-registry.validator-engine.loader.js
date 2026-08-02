/** Target 4B-2 · Contract, integrated registry, and MC5 exact-head preflight loader. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import registryFacade, {
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_SCOPE_NODE as GRATITUDE_NODE,
  H_EARTH_C2_R1_CANDIDATE_PATH_NODE as C2_R1_NODE,
  H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_NODE as INTEGRATED_NODE,
  H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_RELATIONS as INTEGRATED_RELATIONS
} from './accepted-amendments/h-earth.repository-registry.c2-r1-gratitude-integrated-environment.js';
import { deepFreeze, H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY } from './h-earth.repository-registry.validator-engine.identity.js';

const directory=path.dirname(fileURLToPath(import.meta.url));
const readJson=fileName=>JSON.parse(fs.readFileSync(path.join(directory,fileName),'utf8'));
const FILES=Object.freeze({consolidated:'h-earth.repository-registry.validator-contract.json',input:'h-earth.repository-registry.validator-contract.input.json',receipt:'h-earth.repository-registry.validator-contract.receipt.json',dispositions:'h-earth.repository-registry.validator-contract.dispositions.json',failures:'h-earth.repository-registry.validator-contract.failures.json',criticality:'h-earth.repository-registry.validator-contract.criticality.json',algorithm:'h-earth.repository-registry.validator-contract.algorithm.json',instruction:'h-earth.repository-registry.tool-instruction.json'});
const EXPECTED_GRATITUDE_NODE_ID='H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_SCOPE';
const EXPECTED_C2_R1_NODE_ID='H_EARTH_C2_R1_PHYSICALLY_COHERENT_COASTAL_SUCCESSOR_CANDIDATE_PACKAGE';
const EXPECTED_INTEGRATED_NODE_ID='H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT';
const EXPECTED_BRANCH='agent/h-earth-c2-r1-material-only-binding-implementation-001';
const EXPECTED_HEAD='44019e27c3d52c59cc59bba7c833b6317d014273';
const EXPECTED_PACKAGE='H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E';
const EXPECTED_CONTROL_PREFIX='/h-earth-3d/control-plane/coastal-morphology/c2-r1/';
const EXPECTED_COASTAL_PATHS=Object.freeze([
  '/h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js',
  '/h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js',
  '/h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js'
]);
const EXPECTED_RUNTIME_PATHS=Object.freeze([
  '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js'
]);
const EXPECTED_RELATION_IDS=Object.freeze([
  'INTEGRATED_ENVIRONMENT_CONTAINS_GRATITUDE_SPATIAL_DISPOSITION',
  'INTEGRATED_ENVIRONMENT_CONTAINS_C2_R1_COASTAL_COMPONENT'
]);
export const H_EARTH_C2_R1_MC5_PR_484_CHANGED_PATHS=Object.freeze([
  '/.github/workflows/h-earth-c2-r1-complete-world-integration.yml',
  '/h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.allowed-path-manifest.json',
  '/h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-source-custody.json',
  '/h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world-render-package.js',
  '/h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world.js',
  '/h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/identity.json',
  '/h-earth-3d/control-plane/coastal-morphology/c2-r1/tests/h-earth.c2-r1.complete-world-integration.mjs',
  ...EXPECTED_RUNTIME_PATHS
]);
const EXPECTED_OUTSIDE_PATH='/.github/workflows/h-earth-c2-r1-complete-world-integration.yml';
const normalize=value=>{if(typeof value!=='string')return null;let result=value.trim().replaceAll('\\','/');if(result.startsWith('./'))result=result.slice(2);if(!result.startsWith('/'))result=`/${result}`;result=result.replace(/\/{2,}/g,'/');return result.length>1&&result.endsWith('/')?result.slice(0,-1):result};
const sortedUnique=values=>[...new Set(values.map(normalize).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
const sameSet=(left,right)=>JSON.stringify(sortedUnique(left))===JSON.stringify(sortedUnique(right));
const compositeOccurrenceFor=(resolution,repositoryPath)=>(resolution.occurrences??[]).find(record=>
  normalize(record.path)===normalize(repositoryPath)&&
  record.refName===EXPECTED_BRANCH&&
  record.commitSha===EXPECTED_HEAD
);

export function loadHEarthRepositoryRegistryValidatorDependencies(){
  const contracts={consolidated:readJson(FILES.consolidated),input:readJson(FILES.input),receipt:readJson(FILES.receipt),dispositions:readJson(FILES.dispositions),failures:readJson(FILES.failures),criticality:readJson(FILES.criticality),algorithm:readJson(FILES.algorithm),instruction:readJson(FILES.instruction)};
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const expected=H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY;
  const identityChecks={contractId:contracts.consolidated.contractId===expected.contract.contractId,contractVersion:contracts.consolidated.contractVersion===expected.contract.contractVersion,registryId:registryInstance.registryId===expected.registry.registryId,registryVersion:registryInstance.registryVersion===expected.registry.registryVersion,schemaId:registryInstance.schemaId===expected.registry.schemaId,schemaVersion:registryInstance.schemaVersion===expected.registry.schemaVersion,candidateGitBlobSha:discovery.candidateGitBlobSha===expected.registry.candidateGitBlobSha,instructionId:contracts.instruction.instructionId===expected.instruction.instructionId,instructionVersion:contracts.instruction.instructionVersion===expected.instruction.instructionVersion,candidateNotAccepted:registryInstance.accepted===false,candidateNotCanonical:discovery.canonical===false};
  const hEarthChangedPaths=H_EARTH_C2_R1_MC5_PR_484_CHANGED_PATHS.filter(repositoryPath=>repositoryPath!==EXPECTED_OUTSIDE_PATH);
  const changedPathResolutions=hEarthChangedPaths.map(repositoryPath=>({repositoryPath,resolution:registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath)}));
  const runtimeResolutions=changedPathResolutions.filter(({repositoryPath})=>EXPECTED_RUNTIME_PATHS.includes(repositoryPath));
  const relationIds=INTEGRATED_RELATIONS.map(relation=>relation.relationId);
  const currentCompositeOccurrences=INTEGRATED_NODE.repositoryOccurrences??[];
  const exactHeadChecks={
    gratitudeNodePresent:GRATITUDE_NODE.nodeId===EXPECTED_GRATITUDE_NODE_ID&&registryFacade.getHEarthRepositoryRegistryNode(GRATITUDE_NODE.nodeId)===GRATITUDE_NODE,
    c2R1NodePresent:C2_R1_NODE.nodeId===EXPECTED_C2_R1_NODE_ID&&registryFacade.getHEarthRepositoryRegistryNode(C2_R1_NODE.nodeId)===C2_R1_NODE,
    integratedEnvironmentNodePresent:INTEGRATED_NODE.nodeId===EXPECTED_INTEGRATED_NODE_ID&&registryFacade.getHEarthRepositoryRegistryNode(INTEGRATED_NODE.nodeId)===INTEGRATED_NODE,
    twoMembershipRelationsPresent:INTEGRATED_RELATIONS.length===2&&sameSet(relationIds,EXPECTED_RELATION_IDS),
    coastEntryCorrespondsToX0ZMinus96:INTEGRATED_NODE.coastEntryCorrespondence?.corresponds===true&&INTEGRATED_NODE.coastEntryCorrespondence?.worldX===0&&INTEGRATED_NODE.coastEntryCorrespondence?.worldZ===-96,
    allEightHEarthPathsResolved:changedPathResolutions.length===8&&changedPathResolutions.every(({resolution})=>resolution.resolved===true&&(resolution.nodes??[]).some(node=>node.nodeId===EXPECTED_INTEGRATED_NODE_ID)),
    allEightHEarthPathOccurrencesExact:changedPathResolutions.every(({repositoryPath,resolution})=>Boolean(compositeOccurrenceFor(resolution,repositoryPath))),
    twoRuntimePathsResolved:runtimeResolutions.length===2&&runtimeResolutions.every(({repositoryPath,resolution})=>resolution.resolved===true&&Boolean(compositeOccurrenceFor(resolution,repositoryPath))),
    currentBranchOccurrencesBound:currentCompositeOccurrences.length===9&&currentCompositeOccurrences.every(record=>record.refName===EXPECTED_BRANCH),
    currentHeadOccurrencesBound:currentCompositeOccurrences.length===9&&currentCompositeOccurrences.every(record=>record.commitSha===EXPECTED_HEAD),
    controlPrefixPreserved:INTEGRATED_NODE.repositoryPaths.includes(EXPECTED_CONTROL_PREFIX),
    sixCoastalPathsPreserved:EXPECTED_COASTAL_PATHS.every(repositoryPath=>INTEGRATED_NODE.repositoryPaths.includes(repositoryPath)),
    twoRuntimePathsRegistered:EXPECTED_RUNTIME_PATHS.every(repositoryPath=>INTEGRATED_NODE.repositoryPaths.includes(repositoryPath)),
    authorityTransferFalse:INTEGRATED_RELATIONS.every(relation=>relation.authorityEffect==='NO_AUTHORITY_TRANSFER_OR_INHERITANCE')&&INTEGRATED_NODE.authorityLimitations.includes('NO_AUTHORITY_TRANSFER_OR_INHERITANCE'),
    mutationAuthorityFalse:INTEGRATED_RELATIONS.every(relation=>relation.mutationEffect==='NO_MUTATION_AUTHORITY_CREATED')&&INTEGRATED_NODE.authorityLimitations.includes('NO_MUTATION_AUTHORITY_CREATED'),
    continuityEffectExact:INTEGRATED_RELATIONS.every(relation=>relation.continuityEffect==='COASTAL_ENTRY_IS_MEMBER_OF_THE_EXISTING_GRATITUDE_STARTING_ENVIRONMENT'),
    productMutationFalse:INTEGRATED_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION'),
    memberNodesUnmodified:registryInstance.nodes.includes(GRATITUDE_NODE)&&registryInstance.nodes.includes(C2_R1_NODE),
    packageIdentityPreserved:EXPECTED_PACKAGE==='H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E'
  };
  return deepFreeze({
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v4',
    files:FILES,
    contracts,
    registryFacade,
    registryInstance,
    discovery,
    identityChecks,
    identityVerified:Object.values(identityChecks).every(Boolean),
    gratitudeNode:GRATITUDE_NODE,
    c2R1Node:C2_R1_NODE,
    integratedEnvironmentNode:INTEGRATED_NODE,
    integratedEnvironmentRelations:INTEGRATED_RELATIONS,
    exactHeadChecks,
    exactHeadRegistrationVerified:Object.values(exactHeadChecks).every(Boolean),
    integratedEnvironmentVerified:Object.values(exactHeadChecks).every(Boolean),
    mc5ChangedPaths:H_EARTH_C2_R1_MC5_PR_484_CHANGED_PATHS,
    boundary:{readOnly:true,networkDependencyRequired:false,mutationAuthorityCreated:false,authorityTransferCreated:false,workflowEnforcementInstalled:true,productMutationAuthorityCreated:false,pr484MutationAuthorityCreated:false,candidateMutationAuthorityCreated:false,materializationAuthorityCreated:false,mergeAuthorityCreated:false},
    stoppingCondition:{contractAndRegistryLoaderComplete:true,mc5IntegratedEnvironmentLoaded:true,automaticPreflightRequired:true,productMutationAuthorized:false,pr484MutationAuthorized:false,candidateMutationAuthorized:false,materializationRerunAuthorized:false,mergeAuthorized:false}
  });
}

export async function runHEarthC2R1MC5AutomaticRegistryPreflight({paths=H_EARTH_C2_R1_MC5_PR_484_CHANGED_PATHS}={}){
  const dependencies=loadHEarthRepositoryRegistryValidatorDependencies();
  if(dependencies.identityVerified!==true)throw new Error('MC5_REGISTRY_IDENTITY_NOT_VERIFIED');
  if(dependencies.integratedEnvironmentVerified!==true)throw new Error(`MC5_INTEGRATED_ENVIRONMENT_REGISTRATION_FAILED:${JSON.stringify(dependencies.exactHeadChecks)}`);
  if(!sameSet(paths,H_EARTH_C2_R1_MC5_PR_484_CHANGED_PATHS))throw new Error('MC5_PR_484_NINE_PATH_SET_MISMATCH');
  const {runAutomaticHEarthPreflight}=await import('./activation/h-earth.repository-registry.auto-preflight.js');
  const receipt=runAutomaticHEarthPreflight({paths:[...H_EARTH_C2_R1_MC5_PR_484_CHANGED_PATHS],taskText:'PR #484 MC5 Gratitude continuous starting-environment read-only registry verification',mutationIntent:false});
  const classification=receipt.pathClassification;
  const checks={requestedPathCount:classification.normalizedPaths.length===9,exactRequestedPathSet:sameSet(classification.normalizedPaths,H_EARTH_C2_R1_MC5_PR_484_CHANGED_PATHS),expectedOutsideWorkflow:classification.outsidePaths.length===1&&classification.outsidePaths[0]===EXPECTED_OUTSIDE_PATH,hEarthPathCount:classification.hEarthPaths.length===8,allHEarthPathsRegistered:classification.classifications.filter(entry=>entry.insideScopeRoot).every(entry=>entry.registered===true&&entry.classification==='REGISTERED_H_EARTH_PATH'),gratitudeNodePresent:dependencies.exactHeadChecks.gratitudeNodePresent,c2R1NodePresent:dependencies.exactHeadChecks.c2R1NodePresent,integratedEnvironmentNodePresent:dependencies.exactHeadChecks.integratedEnvironmentNodePresent,twoMembershipRelationsPresent:dependencies.exactHeadChecks.twoMembershipRelationsPresent,coastEntryCorrespondsToX0ZMinus96:dependencies.exactHeadChecks.coastEntryCorrespondsToX0ZMinus96,allEightHEarthPathsResolved:dependencies.exactHeadChecks.allEightHEarthPathsResolved,twoRuntimePathsResolved:dependencies.exactHeadChecks.twoRuntimePathsResolved,currentBranchOccurrencesBound:dependencies.exactHeadChecks.currentBranchOccurrencesBound,currentHeadOccurrencesBound:dependencies.exactHeadChecks.currentHeadOccurrencesBound,authorityTransferFalse:dependencies.exactHeadChecks.authorityTransferFalse,productMutationFalse:dependencies.exactHeadChecks.productMutationFalse,dependenciesVerified:receipt.dependenciesVerified===true,validatorDispositionPass:receipt.validatorReceipt?.finalDisposition==='PASS',finalDispositionPass:receipt.finalDisposition==='PASS'};
  if(!Object.values(checks).every(Boolean))throw new Error(`MC5_AUTOMATIC_PREFLIGHT_FAILED:${JSON.stringify(checks)}:${JSON.stringify(receipt)}`);
  return deepFreeze({...receipt,mc5Checks:checks,requiredFinalDisposition:'PASS'});
}

export default loadHEarthRepositoryRegistryValidatorDependencies;
