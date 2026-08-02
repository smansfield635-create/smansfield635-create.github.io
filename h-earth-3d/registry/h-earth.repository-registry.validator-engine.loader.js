/** Target 4B-2 · Contract and registry loader. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Composes all prior accepted overlays through the C2-R1 material-only exact-head
// control-plane admission. This creates verification authority only; it creates
// no product mutation, PR mutation, materialization, merge, or promotion authority.
import registryFacade, {
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE as EXACT_HEAD_NODE,
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE as EXACT_HEAD_EVIDENCE
} from './accepted-amendments/h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js';
import { deepFreeze, H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY } from './h-earth.repository-registry.validator-engine.identity.js';
const directory=path.dirname(fileURLToPath(import.meta.url));
const readJson=fileName=>JSON.parse(fs.readFileSync(path.join(directory,fileName),'utf8'));
const FILES=Object.freeze({consolidated:'h-earth.repository-registry.validator-contract.json',input:'h-earth.repository-registry.validator-contract.input.json',receipt:'h-earth.repository-registry.validator-contract.receipt.json',dispositions:'h-earth.repository-registry.validator-contract.dispositions.json',failures:'h-earth.repository-registry.validator-contract.failures.json',criticality:'h-earth.repository-registry.validator-contract.criticality.json',algorithm:'h-earth.repository-registry.validator-contract.algorithm.json',instruction:'h-earth.repository-registry.tool-instruction.json'});
const EXPECTED_BRANCH='agent/h-earth-c2-r1-material-only-binding-implementation-001';
const EXPECTED_HEAD='44019e27c3d52c59cc59bba7c833b6317d014273';
const EXPECTED_PACKAGE='H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E';
const EXPECTED_RUNTIME_PATHS=Object.freeze([
  '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js'
]);
export function loadHEarthRepositoryRegistryValidatorDependencies(){
  const contracts={consolidated:readJson(FILES.consolidated),input:readJson(FILES.input),receipt:readJson(FILES.receipt),dispositions:readJson(FILES.dispositions),failures:readJson(FILES.failures),criticality:readJson(FILES.criticality),algorithm:readJson(FILES.algorithm),instruction:readJson(FILES.instruction)};
  const registryInstance=registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery=registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const expected=H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY;
  const identityChecks={contractId:contracts.consolidated.contractId===expected.contract.contractId,contractVersion:contracts.consolidated.contractVersion===expected.contract.contractVersion,registryId:registryInstance.registryId===expected.registry.registryId,registryVersion:registryInstance.registryVersion===expected.registry.registryVersion,schemaId:registryInstance.schemaId===expected.registry.schemaId,schemaVersion:registryInstance.schemaVersion===expected.registry.schemaVersion,candidateGitBlobSha:discovery.candidateGitBlobSha===expected.registry.candidateGitBlobSha,instructionId:contracts.instruction.instructionId===expected.instruction.instructionId,instructionVersion:contracts.instruction.instructionVersion===expected.instruction.instructionVersion,candidateNotAccepted:registryInstance.accepted===false,candidateNotCanonical:discovery.canonical===false};
  const exactRuntimeOccurrences=EXACT_HEAD_NODE.repositoryOccurrences.filter(record=>EXPECTED_RUNTIME_PATHS.includes(record.path)&&record.refName===EXPECTED_BRANCH&&record.commitSha===EXPECTED_HEAD);
  const exactHeadChecks={
    lifecycle:EXACT_HEAD_NODE.lifecycleStatus==='CONTROL_PLANE_EXACT_HEAD_REGISTERED',
    evidenceClass:EXACT_HEAD_EVIDENCE.evidenceClass==='CONTROL_PLANE_EXACT_BRANCH_HEAD_AND_RUNTIME_OCCURRENCE_ADMISSION',
    prNumber:EXACT_HEAD_EVIDENCE.prNumber===484,
    branch:EXACT_HEAD_EVIDENCE.candidateBranch===EXPECTED_BRANCH,
    head:EXACT_HEAD_EVIDENCE.candidateHead===EXPECTED_HEAD,
    packageIdentity:EXACT_HEAD_EVIDENCE.packageIdentity===EXPECTED_PACKAGE,
    runtimePathCount:exactRuntimeOccurrences.length===2,
    runtimePaths:EXPECTED_RUNTIME_PATHS.every(runtimePath=>exactRuntimeOccurrences.some(record=>record.path===runtimePath)),
    runtimeBlobIdentities:exactRuntimeOccurrences.every(record=>typeof record.gitBlobSha==='string'&&/^[0-9a-f]{40}$/.test(record.gitBlobSha)),
    productMutationProhibited:EXACT_HEAD_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION'),
    prMutationProhibited:EXACT_HEAD_NODE.authorityLimitations.includes('NO_PR_484_MUTATION'),
    materializationRerunProhibited:EXACT_HEAD_NODE.authorityLimitations.includes('NO_MATERIALIZATION_RERUN'),
    mergeProhibited:EXACT_HEAD_NODE.authorityLimitations.includes('NO_MERGE_PROMOTION_PUBLICATION_OR_USER_REVIEW')
  };
  return deepFreeze({
    loaderId:'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v2',
    files:FILES,
    contracts,
    registryFacade,
    registryInstance,
    discovery,
    identityChecks,
    identityVerified:Object.values(identityChecks).every(Boolean),
    exactHeadNode:EXACT_HEAD_NODE,
    exactHeadEvidence:EXACT_HEAD_EVIDENCE,
    exactHeadChecks,
    exactHeadRegistrationVerified:Object.values(exactHeadChecks).every(Boolean),
    boundary:{readOnly:true,networkDependencyRequired:false,mutationAuthorityCreated:false,workflowEnforcementInstalled:true,productMutationAuthorityCreated:false,pr484MutationAuthorityCreated:false,materializationAuthorityCreated:false,mergeAuthorityCreated:false},
    stoppingCondition:{contractAndRegistryLoaderComplete:true,mc5ExactHeadRegistrationLoaded:true,productMutationAuthorized:false,pr484MutationAuthorized:false,materializationRerunAuthorized:false,mergeAuthorized:false}
  });
}
export default loadHEarthRepositoryRegistryValidatorDependencies;
