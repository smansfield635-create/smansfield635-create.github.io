/** H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_v1 */
import baseFacade from './h-earth.repository-registry.audralia-tablet-single-context-runtime-path-recognition.js';

const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const GOVERNING_MAIN='b3111455e7b7b503bf861f7a294b1d755215340a';
const USER_SPECIFIED_REGISTRY_EQUIVALENT_HEAD='f6bcb230ba66c7747d4e95744c95490e62272eb0';
const FROZEN_BLOCKED_GENERATION='Gen2329';
const FROZEN_BLOCKED_HEAD='686e22b266d7344fe356d5ac91fb979548d87e36';
const FAILED_PREFLIGHT_RUN='35128097880';
const TARGET_PATH='/h-earth-3d/control-plane/run8e-sparse-qualification/execution-authority/admission-receipt.v4.json';
const INVENTED_NEIGHBOR_PATH='/h-earth-3d/control-plane/run8e-sparse-qualification/execution-authority/admission-receipt.v4.neighbor.json';
const PREFIX_PATH='/h-earth-3d/control-plane/run8e-sparse-qualification/execution-authority/';
const NODE_ID='H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID='EVIDENCE_H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_v1';

function deepFreeze(value,seen=new WeakSet()){
  if(value===null||typeof value!=='object'||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))deepFreeze(nested,seen);
  return Object.isFrozen(value)?value:Object.freeze(value);
}
function normalizePath(value){
  if(typeof value!=='string')return null;
  let result=value.trim().replaceAll('\\','/');
  if(result.startsWith('./'))result=result.slice(2);
  if(!result.startsWith('/'))result=`/${result}`;
  result=result.replace(/\/{2,}/g,'/');
  return result.length>1&&result.endsWith('/')?result.slice(0,-1):result;
}

export const H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATHS=Object.freeze([TARGET_PATH]);

const OCCURRENCES=Object.freeze([deepFreeze({
  repository:REPOSITORY,
  refType:'COMMIT',
  refName:GOVERNING_MAIN,
  commitSha:GOVERNING_MAIN,
  path:TARGET_PATH,
  gitBlobSha:null,
  contentSha256:null,
  byteCount:null,
  existenceStatus:'ABSENT',
  fetchbackStatus:'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_BLOCKED_GEN2329_AUTHORITY_BRANCH_MATERIALIZATION',
  occurrenceClass:'AUTHORIZED_RUN8E_SPARSE_ADMISSION_RECEIPT_TARGET_NOT_PRESENT_AT_GOVERNING_MAIN'
})]);

export const H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_EVIDENCE=deepFreeze({
  evidenceId:EVIDENCE_ID,
  evidenceClass:'H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_WITH_TRUTHFUL_ABSENT_OCCURRENCE',
  sourceKind:'GEN2329_AUTOMATIC_PREFLIGHT_STOP_PLUS_EXACT_GOVERNING_MAIN_FETCHBACK',
  sourceIdOrPath:'ISSUE_3569',
  sourceOccurrenceOrRevision:`ISSUE=3569;CANONICAL_LOCK_GENERATION=2339;GOVERNING_MAIN=${GOVERNING_MAIN};USER_SPECIFIED_REGISTRY_EQUIVALENT_HEAD=${USER_SPECIFIED_REGISTRY_EQUIVALENT_HEAD};FROZEN_BLOCKED_GENERATION=${FROZEN_BLOCKED_GENERATION};FROZEN_BLOCKED_HEAD=${FROZEN_BLOCKED_HEAD};FAILED_PREFLIGHT_RUN=${FAILED_PREFLIGHT_RUN}`,
  governingMain:GOVERNING_MAIN,
  userSpecifiedRegistryEquivalentHead:USER_SPECIFIED_REGISTRY_EQUIVALENT_HEAD,
  frozenBlockedGeneration:FROZEN_BLOCKED_GENERATION,
  frozenBlockedHead:FROZEN_BLOCKED_HEAD,
  failedPreflightRun:FAILED_PREFLIGHT_RUN,
  exactTargetPathCount:1,
  registrationEffect:'PATH_RESOLUTION_ONLY',
  evidenceLimitations:Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
    'NO_CANDIDATE_OR_MANIFEST_MUTATION_AUTHORITY',
    'NO_PREFLIGHT_WAIVER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY',
    'NO_INHERITED_OPERATION_AUTHORITY'
  ])
});

export const H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE=deepFreeze({
  nodeId:NODE_ID,
  nodeType:'BOUNDARY_PACKET',
  nodeSubtype:'H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_SCOPE',
  displayName:'H-Earth Run8E Sparse Admission Receipt Exact-Path Recognition',
  description:'Audit-only exact-path registry recognition for the single Run8E sparse-qualification admission receipt path required by automatic H-Earth preflight.',
  repositoryPaths:[TARGET_PATH],
  repositoryOccurrences:OCCURRENCES,
  evidenceClass:H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences:Object.freeze([EVIDENCE_ID]),
  lifecycleStatus:'CANDIDATE_PATH_RECOGNITION',
  authorityClass:'AUDIT_ONLY',
  authorityPosture:'EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect:'PATH_RESOLUTION_ONLY',
  authoritySource:Object.freeze([
    'ISSUE_3569',
    'CANONICAL_OPERATION_ID=H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_REGISTRY_REPAIR_20260916_002',
    'CANONICAL_LOCK_GENERATION_2339',
    `EXACT_GOVERNING_MAIN=${GOVERNING_MAIN}`,
    `USER_SPECIFIED_REGISTRY_EQUIVALENT_HEAD=${USER_SPECIFIED_REGISTRY_EQUIVALENT_HEAD}`,
    `FROZEN_BLOCKED_GENERATION=${FROZEN_BLOCKED_GENERATION}`,
    `FROZEN_BLOCKED_HEAD=${FROZEN_BLOCKED_HEAD}`,
    `FAILED_PREFLIGHT_RUN=${FAILED_PREFLIGHT_RUN}`
  ]),
  authorityScope:Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations:Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
    'NO_CANDIDATE_OR_MANIFEST_MUTATION_AUTHORITY',
    'NO_PREFLIGHT_WAIVER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY',
    'NO_INHERITED_OPERATION_AUTHORITY'
  ]),
  parentRelations:Object.freeze([]),
  childRelations:Object.freeze([]),
  peerRelations:Object.freeze([]),
  upstreamBoundaries:Object.freeze([]),
  downstreamBoundaries:Object.freeze([]),
  dependencyRelations:Object.freeze([]),
  cardinalRole:'NONE',
  cardinalStatus:'NONE',
  cardinalCompleteness:'NOT_APPLICABLE',
  allowedMutationScope:'NONE_REGISTRATION_IS_EXACT_PATH_RESOLUTION_ONLY',
  unresolvedFields:Object.freeze([])
});

const baseInstance=baseFacade.getHEarthRepositoryRegistryInstance();
const registryInstance=deepFreeze({
  ...baseInstance,
  evidenceRecords:[...(baseInstance.evidenceRecords??[]),H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_EVIDENCE],
  nodes:[
    ...baseInstance.nodes.filter(node=>node.nodeId!==NODE_ID),
    H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance(){return registryInstance;}
export function getHEarthRepositoryRegistryNode(nodeId){
  return nodeId===NODE_ID?H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE:baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId){
  return evidenceId===EVIDENCE_ID?H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_EVIDENCE:baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}
export function resolveHEarthRepositoryRegistryPath(repositoryPath){
  const normalized=normalizePath(repositoryPath);
  if(normalized!==TARGET_PATH)return baseFacade.resolveHEarthRepositoryRegistryPath(normalized??repositoryPath);
  const base=baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({
    ...base,
    repositoryPath:normalized,
    resolved:true,
    unresolved:false,
    nodes:[...(base.nodes??[]),H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE],
    occurrences:[...(base.occurrences??[]),...OCCURRENCES]
  });
}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){
  const normalizedPath=input.path==null?null:normalizePath(input.path);
  const localMatches=OCCURRENCES.filter(entry=>{
    if(normalizedPath!=null&&entry.path!==normalizedPath)return false;
    if(input.refType!=null&&entry.refType!==input.refType)return false;
    if(input.refName!=null&&entry.refName!==input.refName)return false;
    if(input.commitSha!=null&&entry.commitSha!==input.commitSha)return false;
    if(input.gitBlobSha!=null&&entry.gitBlobSha!==input.gitBlobSha)return false;
    if(input.existenceStatus!=null&&entry.existenceStatus!==input.existenceStatus)return false;
    return true;
  }).map(occurrence=>deepFreeze({
    nodeId:NODE_ID,
    node:H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE,
    occurrence
  }));
  const base=baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input,...(normalizedPath==null?{}:{path:normalizedPath})});
  return deepFreeze({
    query:base.query,
    matches:[...(base.matches??[]),...localMatches],
    resolved:base.resolved===true||localMatches.length>0
  });
}
export function findHEarthRepositoryRegistryNodes(criteria={}){
  const base=baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node=H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE;
  const normalized=criteria.repositoryPath==null?null:normalizePath(criteria.repositoryPath);
  const matches=(criteria.nodeId==null||criteria.nodeId===NODE_ID)&&
    (normalized==null||normalized===TARGET_PATH)&&
    (criteria.nodeType==null||criteria.nodeType===node.nodeType)&&
    (criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&
    (criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&
    (criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus);
  return deepFreeze(matches?[...base,node]:base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH'){
  return nodeId===NODE_ID?Object.freeze([]):baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId){
  return nodeId===NODE_ID
    ?deepFreeze({nodeId,nodes:[H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE],relations:[],resolved:true})
    :baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}
export function getHEarthRepositoryRegistryDiscoveryDescriptor(){
  return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
}

export function verifyHEarthRun8ESparseAdmissionReceiptPathRecognition(){
  const resolution=resolveHEarthRepositoryRegistryPath(TARGET_PATH);
  const neighborResolution=resolveHEarthRepositoryRegistryPath(INVENTED_NEIGHBOR_PATH);
  const prefixResolution=resolveHEarthRepositoryRegistryPath(PREFIX_PATH);
  const node=H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE;
  const occurrence=OCCURRENCES[0];
  const predecessorNodes=baseInstance.nodes??[];
  const predecessorEvidence=baseInstance.evidenceRecords??[];
  const checks=deepFreeze({
    exactTargetPathCount:H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATHS.length===1&&node.repositoryPaths.length===1,
    exactTargetResolves:resolution.resolved===true&&(resolution.nodes??[]).some(item=>item.nodeId===NODE_ID),
    truthfulAbsentAtGoverningMain:OCCURRENCES.length===1&&occurrence.commitSha===GOVERNING_MAIN&&occurrence.refName===GOVERNING_MAIN&&occurrence.path===TARGET_PATH&&occurrence.existenceStatus==='ABSENT'&&occurrence.gitBlobSha===null&&occurrence.contentSha256===null&&occurrence.byteCount===null,
    inventedNeighborSiblingUnresolved:neighborResolution.resolved!==true&&!(neighborResolution.nodes??[]).some(item=>item.nodeId===NODE_ID),
    exactPathOnly:node.repositoryPaths[0]===TARGET_PATH&&!(prefixResolution.nodes??[]).some(item=>item.nodeId===NODE_ID),
    authorityClassAuditOnly:node.authorityClass==='AUDIT_ONLY',
    authorityPostureExactPathResolutionOnly:node.authorityPosture==='EXACT_PATH_RESOLUTION_ONLY',
    registrationEffectPathResolutionOnly:node.registrationEffect==='PATH_RESOLUTION_ONLY',
    noPrefixWideRegistration:node.authorityLimitations.includes('NO_PREFIX_WIDE_REGISTRATION'),
    noProductOrRuntimeMutationAuthority:node.authorityLimitations.includes('NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY'),
    noCandidateOrManifestMutationAuthority:node.authorityLimitations.includes('NO_CANDIDATE_OR_MANIFEST_MUTATION_AUTHORITY'),
    noPreflightWaiverAuthority:node.authorityLimitations.includes('NO_PREFLIGHT_WAIVER_AUTHORITY'),
    noMergeDeploymentReleaseOrPublicationAuthority:node.authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'),
    noInheritedOperationAuthority:node.authorityLimitations.includes('NO_INHERITED_OPERATION_AUTHORITY'),
    frozenBlockedGenerationBound:FROZEN_BLOCKED_GENERATION==='Gen2329',
    frozenBlockedHeadBound:FROZEN_BLOCKED_HEAD==='686e22b266d7344fe356d5ac91fb979548d87e36',
    failedPreflightBound:FAILED_PREFLIGHT_RUN==='35128097880',
    predecessorRegistryIdentitiesPreserved:registryInstance.registryId===baseInstance.registryId&&registryInstance.registryVersion===baseInstance.registryVersion&&registryInstance.schemaId===baseInstance.schemaId&&registryInstance.schemaVersion===baseInstance.schemaVersion,
    predecessorNodesPreserved:predecessorNodes.every(baseNode=>registryInstance.nodes.some(node=>node.nodeId===baseNode.nodeId)),
    predecessorEvidencePreserved:predecessorEvidence.every(baseEvidence=>(registryInstance.evidenceRecords??[]).some(evidence=>evidence.evidenceId===baseEvidence.evidenceId))
  });
  const eligible=Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status:eligible?'H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_PASS':'H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_FAIL',
    governingMain:GOVERNING_MAIN,
    userSpecifiedRegistryEquivalentHead:USER_SPECIFIED_REGISTRY_EQUIVALENT_HEAD,
    frozenBlockedGeneration:FROZEN_BLOCKED_GENERATION,
    frozenBlockedHead:FROZEN_BLOCKED_HEAD,
    failedPreflightRun:FAILED_PREFLIGHT_RUN,
    targetPath:TARGET_PATH,
    inventedNeighborPath:INVENTED_NEIGHBOR_PATH,
    occurrence,
    checks
  });
}

export default Object.freeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  getHEarthRepositoryRegistryDiscoveryDescriptor
});
