/**
 * H_EARTH_REPOSITORY_REGISTRY_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_v3
 *
 * Read-only control-plane amendment for PR #484. This amendment replaces the
 * current occurrence projection of the existing C2-R1 candidate node while
 * preserving its control prefix and six accepted coastal paths, and adds the
 * two runtime paths required by MC5. It creates no source, product, merge,
 * publication, materialization, or candidate-mutation authority.
 *
 * v3 makes the required predecessor lineage an explicit exported identity so
 * the validator loader can prove that the exact-head amendment is composed on
 * the canonical C2-R1 candidate-path disposition rather than an adjacent
 * registry facade that cannot supply the bounded coastal candidate node.
 */
import baseFacade from './h-earth.repository-registry.c2-r1-candidate-path-disposition.js';

const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);Object.values(value).forEach(item=>freeze(item,seen));return Object.freeze(value)};
const normalizePath=value=>{if(typeof value!=='string')return null;let result=value.trim().replaceAll('\\','/');if(result.startsWith('./'))result=result.slice(2);if(!result.startsWith('/'))result=`/${result}`;result=result.replace(/\/{2,}/g,'/');return result.length>1&&result.endsWith('/')?result.slice(0,-1):result};
const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const NODE_ID='H_EARTH_C2_R1_PHYSICALLY_COHERENT_COASTAL_SUCCESSOR_CANDIDATE_PACKAGE';
const PREDECESSOR_MODULE='./h-earth.repository-registry.c2-r1-candidate-path-disposition.js';
const PREDECESSOR_DISPOSITION_ID='H_EARTH_REPOSITORY_REGISTRY_C2_R1_CANDIDATE_PATH_DISPOSITION_v4';
const PR_NUMBER=484;
const BRANCH='agent/h-earth-c2-r1-material-only-binding-implementation-001';
const HEAD='44019e27c3d52c59cc59bba7c833b6317d014273';
const PACKAGE_IDENTITY='H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E';
const CONTROL_PREFIX='/h-earth-3d/control-plane/coastal-morphology/c2-r1/';
const CONTROL_PREFIX_NORMALIZED=normalizePath(CONTROL_PREFIX);
const COASTAL_PATHS=Object.freeze([
  '/h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js',
  '/h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js',
  '/h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js'
]);
const RUNTIME_PATHS=Object.freeze([
  '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js'
]);
const RUNTIME_BLOBS=freeze({
  [RUNTIME_PATHS[0]]:'4b1d9e685711478a6d1a314031ac9448c49f78c9',
  [RUNTIME_PATHS[1]]:'2b8103b182cfb5fcee84c94afaecd2a1cf329a7f'
});
const REGISTRY_PATHS=Object.freeze([CONTROL_PREFIX,...COASTAL_PATHS,...RUNTIME_PATHS]);
export const requireC2R1BaseRegistryNode=(facade=baseFacade,nodeId=NODE_ID)=>{
  const node=facade?.getHEarthRepositoryRegistryNode?.(nodeId)??null;
  if(!node)throw new Error(`C2_R1_BASE_REGISTRY_NODE_NOT_FOUND:${nodeId}`);
  return node;
};
const BASE_NODE=requireC2R1BaseRegistryNode();
export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_BASE_LINEAGE=freeze({
  schema:'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_BASE_LINEAGE_v1',
  predecessorModule:PREDECESSOR_MODULE,
  predecessorDispositionId:PREDECESSOR_DISPOSITION_ID,
  requiredNodeId:NODE_ID,
  observedNodeId:BASE_NODE.nodeId,
  predecessorNodePresent:true,
  readOnly:true,
  mutationAuthorityCreated:false,
  mergeAuthorityCreated:false
});

const occurrenceFor=path=>freeze({
  repository:REPOSITORY,
  refType:'BRANCH',
  refName:BRANCH,
  commitSha:HEAD,
  path,
  gitBlobSha:RUNTIME_BLOBS[path]??null,
  contentSha256:null,
  byteCount:null,
  existenceStatus:'PRESENT',
  fetchbackStatus:'VERIFIED_EXACT_HEAD',
  occurrenceClass:'C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_CANDIDATE'
});
const CURRENT_OCCURRENCES=Object.freeze(REGISTRY_PATHS.map(occurrenceFor));
const isControlPath=path=>path===CONTROL_PREFIX_NORMALIZED||path.startsWith(`${CONTROL_PREFIX_NORMALIZED}/`);
const isManagedPath=path=>isControlPath(path)||COASTAL_PATHS.includes(path)||RUNTIME_PATHS.includes(path);
const occurrencesForPath=path=>{
  if(isControlPath(path))return CURRENT_OCCURRENCES.filter(record=>record.path===CONTROL_PREFIX);
  return CURRENT_OCCURRENCES.filter(record=>normalizePath(record.path)===path);
};

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE=freeze({
  evidenceId:'EVIDENCE_H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_v2',
  evidenceClass:'CONTROL_PLANE_EXACT_BRANCH_HEAD_AND_COMPLETE_C2_R1_OCCURRENCE_ADMISSION',
  sourceKind:'PR_EXACT_HEAD_REGISTRY_AMENDMENT',
  sourceIdOrPath:`PR_${PR_NUMBER}`,
  sourceOccurrenceOrRevision:`PR=${PR_NUMBER};BRANCH=${BRANCH};HEAD=${HEAD};PACKAGE=${PACKAGE_IDENTITY}`,
  verifiedOn:'2026-08-02',
  prNumber:PR_NUMBER,
  candidateBranch:BRANCH,
  candidateHead:HEAD,
  packageIdentity:PACKAGE_IDENTITY,
  predecessorLineage:H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_BASE_LINEAGE,
  preservedControlPrefix:CONTROL_PREFIX,
  preservedCoastalPaths:COASTAL_PATHS,
  runtimePaths:RUNTIME_PATHS,
  currentOccurrenceCount:CURRENT_OCCURRENCES.length,
  currentOccurrences:CURRENT_OCCURRENCES,
  evidenceLimitations:freeze([
    'NO_PRODUCT_MUTATION',
    'NO_PR_484_MUTATION',
    'NO_CANDIDATE_MUTATION',
    'NO_MATERIALIZATION_RERUN',
    'NO_MERGE',
    'NO_PUBLICATION_OR_PROMOTION',
    'NO_USER_DIFFERENTIAL'
  ])
});

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE=freeze({
  ...BASE_NODE,
  repositoryPaths:REGISTRY_PATHS,
  repositoryOccurrences:CURRENT_OCCURRENCES,
  evidenceReferences:Object.freeze([...new Set([...BASE_NODE.evidenceReferences,H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE.evidenceId])]),
  authorityPosture:'C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_REGISTERED_FOR_MC5',
  authorityScope:Object.freeze([...new Set([...BASE_NODE.authorityScope,'C2_R1_PREDECESSOR_LINEAGE_EXPLICITLY_BOUND','C2_R1_CONTROL_PREFIX_PRESERVED','SIX_C2_R1_COASTAL_PATHS_PRESERVED','TWO_CURRENT_RUNTIME_PATHS_REGISTERED','ALL_CURRENT_OCCURRENCES_BOUND_TO_PR_484_EXACT_HEAD','MC5_READ_ONLY_EXACT_HEAD_VERIFICATION'])]),
  authorityLimitations:Object.freeze([...new Set([...BASE_NODE.authorityLimitations,'NO_PRODUCT_MUTATION','NO_PR_484_MUTATION','NO_CANDIDATE_MUTATION','NO_MATERIALIZATION_RERUN','NO_MERGE_PROMOTION_PUBLICATION_OR_USER_REVIEW'])]),
  orderingRules:Object.freeze([...new Set([...BASE_NODE.orderingRules,'C2_R1_CANDIDATE_PATH_DISPOSITION_BEFORE_EXACT_HEAD_AMENDMENT','CONTROL_PLANE_REGISTRATION_BEFORE_MC5_EXACT_HEAD_VERIFICATION','MC5_VERIFICATION_BEFORE_ROLE_3_HANDOFF'])]),
  requiredValidations:Object.freeze([...new Set([...BASE_NODE.requiredValidations,'C2_R1_PREDECESSOR_LINEAGE_VERIFIED','AUTOMATIC_REPOSITORY_PREFLIGHT_FINAL_DISPOSITION_PASS','ALL_NINE_PR_484_CHANGED_PATHS_CLASSIFIED','ALL_CURRENT_OCCURRENCES_BIND_EXACT_BRANCH_AND_HEAD','CACHE_V2_AND_PACKAGE_STATIC_VERIFICATION','DESKTOP_AND_TWO_MOBILE_BROWSER_EXECUTION'])]),
  stoppingBoundaries:Object.freeze([...new Set([...BASE_NODE.stoppingBoundaries,'STOP_ON_C2_R1_PREDECESSOR_LINEAGE_MISMATCH','STOP_BEFORE_PRODUCT_OR_CANDIDATE_MUTATION','STOP_BEFORE_PR_484_MUTATION','STOP_BEFORE_MATERIALIZATION_RERUN_OR_MERGE'])]),
  currentIdentityReferences:Object.freeze([...new Set([...BASE_NODE.currentIdentityReferences,`C2_R1_PREDECESSOR=${PREDECESSOR_DISPOSITION_ID}`,`PR_484_BRANCH=${BRANCH}`,`PR_484_HEAD=${HEAD}`,`PR_484_PACKAGE=${PACKAGE_IDENTITY}`])]),
  lifecycleStatus:'CONTROL_PLANE_EXACT_HEAD_REGISTERED'
});

const NODE=H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE;
const EVIDENCE=H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE;
const baseInstance=freeze({...baseFacade.getHEarthRepositoryRegistryInstance()});
const combinedInstance=freeze({
  ...baseInstance,
  evidenceRecords:[...baseInstance.evidenceRecords.filter(record=>record.evidenceId!==EVIDENCE.evidenceId),EVIDENCE],
  nodes:baseInstance.nodes.map(node=>node.nodeId===NODE.nodeId?NODE:node)
});
export const getHEarthRepositoryRegistryInstance=()=>combinedInstance;
export const getHEarthRepositoryRegistryNode=nodeId=>nodeId===NODE.nodeId?NODE:baseFacade.getHEarthRepositoryRegistryNode(nodeId);
export const getHEarthRepositoryRegistryEvidence=evidenceId=>evidenceId===EVIDENCE.evidenceId?EVIDENCE:baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
export function resolveHEarthRepositoryRegistryPath(repositoryPath){
  const normalized=normalizePath(repositoryPath);
  if(!normalized||!isManagedPath(normalized))return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  return freeze({repositoryPath:normalized,resolved:true,nodes:[NODE],occurrences:occurrencesForPath(normalized),unresolved:false});
}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){
  const base=baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  const normalized=normalizePath(input.path);
  const localCandidates=input.path==null?CURRENT_OCCURRENCES:(normalized&&isManagedPath(normalized)?occurrencesForPath(normalized):[]);
  const local=localCandidates.filter(record=>(input.commitSha==null||record.commitSha===input.commitSha)&&(input.gitBlobSha==null||record.gitBlobSha===input.gitBlobSha)&&(input.refName==null||record.refName===input.refName)).map(occurrence=>freeze({nodeId:NODE.nodeId,node:NODE,occurrence}));
  const baseMatches=(base.matches??[]).filter(match=>match.nodeId!==NODE.nodeId);
  return freeze({query:base.query??freeze({...input,path:normalized}),matches:[...baseMatches,...local],resolved:baseMatches.length>0||local.length>0});
}
export const findHEarthRepositoryRegistryNodes=criteria=>freeze(baseFacade.findHEarthRepositoryRegistryNodes(criteria).map(node=>node.nodeId===NODE.nodeId?NODE:node));
export const getHEarthRepositoryRegistryRelationsForNode=(nodeId,direction='BOTH')=>baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);
export const getHEarthRepositoryRegistryDependencyClosure=nodeId=>{
  const closure=baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
  if(nodeId!==NODE.nodeId)return closure;
  return freeze({...closure,nodes:(closure.nodes??[]).map(node=>node.nodeId===NODE.nodeId?NODE:node)});
};
export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_FACADE=freeze({...baseFacade,getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,getHEarthRepositoryRegistryRelationsForNode,getHEarthRepositoryRegistryDependencyClosure});
export default H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_FACADE;
