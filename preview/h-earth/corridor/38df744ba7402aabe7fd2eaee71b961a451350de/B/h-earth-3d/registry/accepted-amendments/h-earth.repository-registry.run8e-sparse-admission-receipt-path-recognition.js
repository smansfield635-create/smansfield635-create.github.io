/** H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_v1 */
import baseFacade from './h-earth.repository-registry.audralia-tablet-single-context-runtime-path-recognition.js';

const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const GOVERNING_MAIN='b3111455e7b7b503bf861f7a294b1d755215340a';
const GEN2329_AUTHORITY_HEAD='686e22b266d7344fe356d5ac91fb979548d87e36';
const FAILED_PREFLIGHT_RUN=35128097880;
const GEN2329_TERMINAL_COMMENT_ID=5702046106;
const TARGET='/h-earth-3d/control-plane/run8e-sparse-qualification/execution-authority/admission-receipt.v4.json';
const NEIGHBOR='/h-earth-3d/control-plane/run8e-sparse-qualification/execution-authority/admission-receipt.v4-NOT-REGISTERED.json';
const NODE_ID='H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_SCOPE';

function deepFreeze(value,seen=new WeakSet()){if(value===null||typeof value!=='object'||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))deepFreeze(nested,seen);return Object.isFrozen(value)?value:Object.freeze(value);}
function normalizePath(value){if(typeof value!=='string')return null;let result=value.trim().replaceAll('\\\\','/');if(result.startsWith('./'))result=result.slice(2);if(!result.startsWith('/'))result=`/${result}`;result=result.replace(/\/{2,}/g,'/');return result.length>1&&result.endsWith('/')?result.slice(0,-1):result;}

const OCCURRENCE=deepFreeze({
  repository:REPOSITORY,
  refType:'COMMIT',
  refName:GOVERNING_MAIN,
  commitSha:GOVERNING_MAIN,
  path:TARGET,
  gitBlobSha:null,
  contentSha256:null,
  byteCount:null,
  existenceStatus:'ABSENT',
  fetchbackStatus:'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_GEN2329_AUTHORITY_BRANCH_MATERIALIZATION',
  occurrenceClass:'RUN8E_GEN2329_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_ABSENT_AT_GOVERNING_MAIN'
});

export const H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE=deepFreeze({
  nodeId:NODE_ID,
  nodeType:'BOUNDARY_PACKET',
  nodeSubtype:'H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_EXACT_PATH_RECOGNITION_SCOPE',
  displayName:'H-Earth Run8E Sparse Admission Receipt Exact-Path Recognition',
  description:'Read-only exact-path recognition for the single Gen2329 sparse-qualification admission receipt path required by automatic H-Earth repository preflight.',
  repositoryPaths:[TARGET],
  repositoryOccurrences:[OCCURRENCE],
  lifecycleStatus:'CANDIDATE_PATH_RECOGNITION',
  authorityClass:'AUDIT_ONLY',
  authorityPosture:'EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect:'PATH_RESOLUTION_ONLY',
  authoritySource:[
    'ISSUE_3550',
    'CANONICAL_LOCK_GENERATION_2338',
    `EXACT_GOVERNING_MAIN=${GOVERNING_MAIN}`,
    `GEN2329_AUTHORITY_HEAD=${GEN2329_AUTHORITY_HEAD}`,
    `FAILED_PREFLIGHT_RUN=${FAILED_PREFLIGHT_RUN}`,
    `GEN2329_TERMINAL_COMMENT_ID=${GEN2329_TERMINAL_COMMENT_ID}`
  ],
  authorityScope:[
    'EXACT_PATH_RESOLUTION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION',
    'READ_ONLY_PREFLIGHT_RESOLUTION'
  ],
  authorityLimitations:[
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
    'NO_CANDIDATE_OR_MANIFEST_MUTATION_AUTHORITY',
    'NO_RENDER_OR_CAMERA_MUTATION_AUTHORITY',
    'NO_PREFLIGHT_WAIVER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY',
    'NO_INHERITED_OPERATION_AUTHORITY'
  ],
  parentRelations:[],
  childRelations:[],
  peerRelations:[],
  upstreamBoundaries:[],
  downstreamBoundaries:[],
  dependencyRelations:[],
  cardinalRole:'NONE',
  cardinalStatus:'NONE',
  cardinalCompleteness:'NOT_APPLICABLE',
  allowedMutationScope:'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION',
  unresolvedFields:[]
});

const baseInstance=baseFacade.getHEarthRepositoryRegistryInstance();
const registryInstance=deepFreeze({...baseInstance,nodes:[
  ...baseInstance.nodes.filter(node=>node.nodeId!==NODE_ID),
  H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE
]});

export function getHEarthRepositoryRegistryInstance(){return registryInstance;}
export function getHEarthRepositoryRegistryNode(nodeId){return nodeId===NODE_ID?H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE:baseFacade.getHEarthRepositoryRegistryNode(nodeId);}
export function getHEarthRepositoryRegistryEvidence(evidenceId){return baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);}
export function resolveHEarthRepositoryRegistryPath(repositoryPath){
  const normalized=normalizePath(repositoryPath);
  if(normalized!==TARGET)return baseFacade.resolveHEarthRepositoryRegistryPath(normalized??repositoryPath);
  const base=baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({...base,repositoryPath:normalized,resolved:true,unresolved:false,
    nodes:[...(base.nodes??[]),H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE],
    occurrences:[...(base.occurrences??[]),OCCURRENCE]});
}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){
  const normalized=input.path==null?null:normalizePath(input.path);
  const matches=(normalized==null||normalized===TARGET)&&
    (input.refType==null||input.refType===OCCURRENCE.refType)&&
    (input.refName==null||input.refName===OCCURRENCE.refName)&&
    (input.commitSha==null||input.commitSha===OCCURRENCE.commitSha)&&
    (input.gitBlobSha==null||input.gitBlobSha===OCCURRENCE.gitBlobSha)&&
    (input.existenceStatus==null||input.existenceStatus===OCCURRENCE.existenceStatus);
  const base=baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input,...(normalized==null?{}:{path:normalized})});
  return deepFreeze({query:base.query,matches:[...(base.matches??[]),...(matches?[{nodeId:NODE_ID,node:H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE,occurrence:OCCURRENCE}]:[])],resolved:base.resolved===true||matches});
}
export function findHEarthRepositoryRegistryNodes(criteria={}){
  const base=baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const normalized=criteria.repositoryPath==null?null:normalizePath(criteria.repositoryPath);
  const node=H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE;
  const match=(criteria.nodeId==null||criteria.nodeId===NODE_ID)&&
    (normalized==null||normalized===TARGET)&&
    (criteria.nodeType==null||criteria.nodeType===node.nodeType)&&
    (criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&
    (criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&
    (criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus);
  return deepFreeze(match?[...base,node]:base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH'){return nodeId===NODE_ID?Object.freeze([]):baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId){return nodeId===NODE_ID?deepFreeze({nodeId,nodes:[H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE],relations:[],resolved:true}):baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);}
export function getHEarthRepositoryRegistryDiscoveryDescriptor(){return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();}

export function verifyHEarthRun8ESparseAdmissionReceiptPathRecognition(){
  const resolution=resolveHEarthRepositoryRegistryPath(TARGET);
  const neighborResolution=resolveHEarthRepositoryRegistryPath(NEIGHBOR);
  const node=H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_NODE;
  const checks=deepFreeze({
    exactTargetPathCount:node.repositoryPaths.length===1&&node.repositoryPaths[0]===TARGET,
    targetPathResolves:resolution.resolved===true&&(resolution.nodes??[]).some(entry=>entry.nodeId===NODE_ID),
    neighborRemainsUnresolved:neighborResolution.resolved!==true&&!(neighborResolution.nodes??[]).some(entry=>entry.nodeId===NODE_ID),
    truthfulAbsentAtGoverningMain:OCCURRENCE.commitSha===GOVERNING_MAIN&&OCCURRENCE.existenceStatus==='ABSENT'&&OCCURRENCE.gitBlobSha===null&&OCCURRENCE.contentSha256===null&&OCCURRENCE.byteCount===null,
    exactPathOnly:TARGET.endsWith('/admission-receipt.v4.json')&&NEIGHBOR!==TARGET,
    noPrefixRegistration:node.repositoryPaths.every(path=>path===TARGET),
    auditOnly:node.authorityClass==='AUDIT_ONLY',
    pathResolutionOnly:node.registrationEffect==='PATH_RESOLUTION_ONLY',
    noProductRuntimeAuthority:node.authorityLimitations.includes('NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY'),
    noCandidateManifestAuthority:node.authorityLimitations.includes('NO_CANDIDATE_OR_MANIFEST_MUTATION_AUTHORITY'),
    noRenderCameraAuthority:node.authorityLimitations.includes('NO_RENDER_OR_CAMERA_MUTATION_AUTHORITY'),
    noPreflightWaiver:node.authorityLimitations.includes('NO_PREFLIGHT_WAIVER_AUTHORITY'),
    noPublicationAuthority:node.authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'),
    noInheritedAuthority:node.authorityLimitations.includes('NO_INHERITED_OPERATION_AUTHORITY'),
    gen2329EvidenceBound:GEN2329_AUTHORITY_HEAD==='686e22b266d7344fe356d5ac91fb979548d87e36'&&FAILED_PREFLIGHT_RUN===35128097880&&GEN2329_TERMINAL_COMMENT_ID===5702046106
  });
  const eligible=Object.values(checks).every(Boolean);
  return deepFreeze({
    schema:'H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_VERIFICATION_v1',
    eligible,
    status:eligible?'H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_PASS':'H_EARTH_RUN8E_SPARSE_ADMISSION_RECEIPT_PATH_RECOGNITION_FAIL',
    governingMain:GOVERNING_MAIN,
    gen2329AuthorityHead:GEN2329_AUTHORITY_HEAD,
    failedPreflightRun:FAILED_PREFLIGHT_RUN,
    gen2329TerminalCommentId:GEN2329_TERMINAL_COMMENT_ID,
    targetPath:TARGET,
    neighborPath:NEIGHBOR,
    checks
  });
}

export default Object.freeze({...baseFacade,getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,getHEarthRepositoryRegistryRelationsForNode,getHEarthRepositoryRegistryDependencyClosure,getHEarthRepositoryRegistryDiscoveryDescriptor});
