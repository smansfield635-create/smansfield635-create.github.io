/**
 * H_EARTH_REPOSITORY_REGISTRY_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_v1
 *
 * Control-plane-only registry overlay for PR #484. It admits one frozen branch
 * occurrence and the two exact runtime files required by MC5 preflight. It
 * creates no product mutation, merge, promotion, publication, or materialization
 * authority.
 */
import baseFacade, {
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_SCOPE_NODE as BASE_NODE,
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_EVIDENCE as BASE_EVIDENCE
} from './h-earth.repository-registry.gratitude-region-final-spatial-placement-disposition.js';

const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);Object.values(value).forEach(item=>freeze(item,seen));return Object.freeze(value)};
const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const PR_NUMBER=484;
const BRANCH='agent/h-earth-c2-r1-material-only-binding-implementation-001';
const HEAD='44019e27c3d52c59cc59bba7c833b6317d014273';
const PACKAGE_IDENTITY='H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E';
const RUNTIME_OCCURRENCES=Object.freeze([
  freeze({
    repository:REPOSITORY,
    refType:'BRANCH',
    refName:BRANCH,
    commitSha:HEAD,
    path:'/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
    gitBlobSha:'4b1d9e685711478a6d1a314031ac9448c49f78c9',
    contentSha256:null,
    byteCount:null,
    existenceStatus:'PRESENT',
    fetchbackStatus:'VERIFIED_EXACT_HEAD',
    occurrenceClass:'C2_R1_MATERIAL_ONLY_BINDING_RUNTIME_EXACT_HEAD'
  }),
  freeze({
    repository:REPOSITORY,
    refType:'BRANCH',
    refName:BRANCH,
    commitSha:HEAD,
    path:'/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js',
    gitBlobSha:'2b8103b182cfb5fcee84c94afaecd2a1cf329a7f',
    contentSha256:null,
    byteCount:null,
    existenceStatus:'PRESENT',
    fetchbackStatus:'VERIFIED_EXACT_HEAD',
    occurrenceClass:'C2_R1_MATERIAL_ONLY_BINDING_RUNTIME_EXACT_HEAD'
  })
]);
const ALL_OCCURRENCES=Object.freeze([...BASE_NODE.repositoryOccurrences,...RUNTIME_OCCURRENCES]);
const ALL_PATHS=Object.freeze([...new Set(ALL_OCCURRENCES.map(record=>record.path))]);

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE=freeze({
  evidenceId:'EVIDENCE_H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_v1',
  evidenceClass:'CONTROL_PLANE_EXACT_BRANCH_HEAD_AND_RUNTIME_OCCURRENCE_ADMISSION',
  sourceKind:'PR_EXACT_HEAD_REGISTRY_ADMISSION',
  sourceIdOrPath:`PR_${PR_NUMBER}`,
  sourceOccurrenceOrRevision:`PR=${PR_NUMBER};BRANCH=${BRANCH};HEAD=${HEAD};PACKAGE=${PACKAGE_IDENTITY}`,
  verifiedOn:'2026-08-02',
  prNumber:PR_NUMBER,
  candidateBranch:BRANCH,
  candidateHead:HEAD,
  packageIdentity:PACKAGE_IDENTITY,
  runtimePathCount:RUNTIME_OCCURRENCES.length,
  runtimeOccurrences:RUNTIME_OCCURRENCES,
  evidenceLimitations:freeze([
    'NO_PRODUCT_MUTATION',
    'NO_PR_484_MUTATION',
    'NO_MATERIALIZATION_RERUN',
    'NO_MERGE',
    'NO_PUBLICATION_OR_PROMOTION',
    'NO_USER_DIFFERENTIAL'
  ])
});

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE=freeze({
  ...BASE_NODE,
  repositoryPaths:ALL_PATHS,
  repositoryOccurrences:ALL_OCCURRENCES,
  evidenceReferences:Object.freeze([...BASE_NODE.evidenceReferences,H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE.evidenceId]),
  authorityPosture:'C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_REGISTERED_FOR_MC5',
  authorityScope:Object.freeze([...BASE_NODE.authorityScope,'PR_484_EXACT_BRANCH_AND_HEAD_REGISTERED','TWO_RUNTIME_PATHS_REGISTERED','MC5_EXACT_HEAD_VERIFICATION_ADMISSIBLE']),
  authorityLimitations:Object.freeze([...new Set([...BASE_NODE.authorityLimitations,'NO_PRODUCT_MUTATION','NO_PR_484_MUTATION','NO_MATERIALIZATION_RERUN','NO_MERGE_PROMOTION_PUBLICATION_OR_USER_REVIEW'])]),
  orderingRules:Object.freeze([...BASE_NODE.orderingRules,'CONTROL_PLANE_REGISTRATION_BEFORE_MC5_EXACT_HEAD_VERIFICATION','MC5_VERIFICATION_BEFORE_ROLE_3_HANDOFF']),
  requiredValidations:Object.freeze([...BASE_NODE.requiredValidations,'PR_484_HEAD_EQUALS_44019e27c3d52c59cc59bba7c833b6317d014273','RUNTIME_PATH_COUNT_EQUALS_2','RUNTIME_BLOB_IDENTITIES_MATCH','PACKAGE_IDENTITY_EQUALS_H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E']),
  stoppingBoundaries:Object.freeze(['STOP_BEFORE_PRODUCT_MUTATION','STOP_BEFORE_PR_484_MUTATION','STOP_BEFORE_MATERIALIZATION_RERUN_OR_MERGE']),
  currentIdentityReferences:Object.freeze([...BASE_NODE.currentIdentityReferences,`PR_484_BRANCH=${BRANCH}`,`PR_484_HEAD=${HEAD}`,`PR_484_PACKAGE=${PACKAGE_IDENTITY}`]),
  lifecycleStatus:'CONTROL_PLANE_EXACT_HEAD_REGISTERED'
});

const NODE=H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE;
const EVIDENCE=H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE;
const baseInstance=baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance=freeze({
  ...baseInstance,
  evidenceRecords:[...baseInstance.evidenceRecords,EVIDENCE],
  nodes:baseInstance.nodes.map(node=>node.nodeId===NODE.nodeId?NODE:node)
});
export const getHEarthRepositoryRegistryInstance=()=>combinedInstance;
export const getHEarthRepositoryRegistryNode=nodeId=>nodeId===NODE.nodeId?NODE:baseFacade.getHEarthRepositoryRegistryNode(nodeId);
export const getHEarthRepositoryRegistryEvidence=evidenceId=>evidenceId===EVIDENCE.evidenceId?EVIDENCE:evidenceId===BASE_EVIDENCE.evidenceId?BASE_EVIDENCE:baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
export function resolveHEarthRepositoryRegistryPath(repositoryPath){if(!NODE.repositoryPaths.includes(repositoryPath))return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);return freeze({repositoryPath,resolved:true,nodes:[NODE],occurrences:NODE.repositoryOccurrences.filter(record=>record.path===repositoryPath),unresolved:false})}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){const base=baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);const baseMatches=(base.matches??[]).filter(match=>match.nodeId!==NODE.nodeId);const local=NODE.repositoryOccurrences.filter(record=>(input.path==null||record.path===input.path)&&(input.commitSha==null||record.commitSha===input.commitSha)&&(input.gitBlobSha==null||record.gitBlobSha===input.gitBlobSha)&&(input.refName==null||record.refName===input.refName)).map(occurrence=>freeze({nodeId:NODE.nodeId,node:NODE,occurrence}));return freeze({query:base.query,matches:[...baseMatches,...local],resolved:baseMatches.length>0||local.length>0})}
export const findHEarthRepositoryRegistryNodes=criteria=>freeze(baseFacade.findHEarthRepositoryRegistryNodes(criteria).map(node=>node.nodeId===NODE.nodeId?NODE:node));
export const getHEarthRepositoryRegistryRelationsForNode=(nodeId,direction='BOTH')=>nodeId===NODE.nodeId?Object.freeze([]):baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);
export const getHEarthRepositoryRegistryDependencyClosure=nodeId=>nodeId===NODE.nodeId?freeze({nodeId,nodes:[NODE],relations:[],unresolved:false}):baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_FACADE=freeze({...baseFacade,getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,getHEarthRepositoryRegistryRelationsForNode,getHEarthRepositoryRegistryDependencyClosure});
export default H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_FACADE;
