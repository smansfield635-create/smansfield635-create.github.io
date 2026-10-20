/**
 * GCR2 four exact proof-path registry successor. Administrative/read-only only.
 * Four targets absent at governing main, present at frozen GCR2 draft head.
 * No branch, renderer, anchor, product, release or waiver authority.
 */
import baseFacade from './h-earth.repository-registry.mountain-traversal-20261006-path-recognition.js';

const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const GOVERNING_MAIN='92e241f27b79cd50a09e4b0ef8f47e080bc5e0d4';
const FROZEN_GCR2_CANDIDATE='2dbbd9feafb47078aeacde2579a30d94b648af25';
const NODE_ID='H_EARTH_AUDRALIA_GCR2_EXACT_PROOF_PATH_RECOGNITION_SCOPE';
const TARGET_BLOBS=Object.freeze({
  "/h-earth-3d/evidence/audralia-gratitude-gcr2/continuation.json": "ef7c46d4cdfcf5220f10ecaac26b242672963186",
  "/h-earth-3d/evidence/audralia-gratitude-gcr2/operation-packet.json": "857f6e40c62c57df6fd7bac4b0c2a02efb4e8cb3",
  "/h-earth-3d/evidence/audralia-gratitude-gcr2/qualification.json": "6ae0843989d2c349d189f0ae87c9fc137419ef64",
  "/h-earth-3d/validation/audralia-gratitude-gcr2.v1.test.mjs": "7785b6b3aef1d6c442d80e67764b2fd56c65429a"
});
export const GCR2_PROOF_PATHS=Object.freeze(Object.keys(TARGET_BLOBS));
function deepFreeze(value,seen=new WeakSet()){
 if(value===null||typeof value!=='object'||seen.has(value))return value;
 seen.add(value);for(const nested of Object.values(value))deepFreeze(nested,seen);
 return Object.isFrozen(value)?value:Object.freeze(value);
}
function normalizePath(value){
 if(typeof value!=='string')return null;
 let path=value.trim().replaceAll('\\','/');
 if(path.startsWith('./'))path=path.slice(2);
 if(!path.startsWith('/'))path='/'+path;
 path=path.replace(/\/{2,}/g,'/');
 return path.length>1&&path.endsWith('/')?path.slice(0,-1):path;
}
const OCCURRENCES=deepFreeze(GCR2_PROOF_PATHS.flatMap(path=>[
 {repository:REPOSITORY,refType:'COMMIT',refName:GOVERNING_MAIN,commitSha:GOVERNING_MAIN,path,
  gitBlobSha:null,contentSha256:null,byteCount:null,existenceStatus:'ABSENT',
  fetchbackStatus:'VERIFIED_ABSENT_AT_EXACT_GOVERNING_MAIN',
  occurrenceClass:'GCR2_PROOF_PATH_TRUTHFUL_MAIN_ABSENCE'},
 {repository:REPOSITORY,refType:'COMMIT',refName:FROZEN_GCR2_CANDIDATE,commitSha:FROZEN_GCR2_CANDIDATE,path,
  gitBlobSha:TARGET_BLOBS[path],contentSha256:null,byteCount:null,existenceStatus:'PRESENT',
  fetchbackStatus:'VERIFIED_PRESENT_AT_FROZEN_GCR2_CANDIDATE',
  occurrenceClass:'GCR2_PROOF_PATH_CANDIDATE_OCCURRENCE'}
]));
const EVIDENCE_ID='EVIDENCE_H_EARTH_GCR2_FOUR_EXACT_PROOF_PATH_REGISTRATION_v1';
export const GCR2_PROOF_PATH_RECOGNITION_EVIDENCE=deepFreeze({
 evidenceId:EVIDENCE_ID,
 evidenceClass:'H_EARTH_GCR2_FOUR_EXACT_PROOF_PATHS_CANDIDATE_AND_ABSENT_BASE',
 sourceKind:'SELECTED_NATIVE_H_EARTH_REGISTRY_PREFLIGHT_STOP_AND_EXACT_HEAD_GITHUB_SOURCE',
 sourceIdOrPath:'ISSUE_6557',
 sourceOccurrenceOrRevision:'FAILED_RUN=39296686857;BLOCKED_PR=6554;CANDIDATE='+FROZEN_GCR2_CANDIDATE+
  ';REGISTRY_ADMISSION_GEN=2821;ORIGINAL_GCR2_ADMISSION_GEN=2819',
 registrationEffect:'PATH_RESOLUTION_AUTHORITY_ONLY',targetPaths:GCR2_PROOF_PATHS,
 governingMain:GOVERNING_MAIN,frozenCandidate:FROZEN_GCR2_CANDIDATE,
 evidenceLimitations:[
  'NO_PRODUCT_RUNTIME_OR_TERRAIN_MUTATION_AUTHORITY',
  'NO_GCR2_EVIDENCE_OR_TEST_CONTENT_MUTATION_AUTHORITY',
  'NO_PREFIX_OR_WILDCARD_REGISTRATION',
  'NO_PREFLIGHT_OR_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY',
  'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
 ]
});
export const GCR2_PROOF_PATH_RECOGNITION_NODE=deepFreeze({
 nodeId:NODE_ID,nodeType:'BOUNDARY_PACKET',
 nodeSubtype:'H_EARTH_AUDRALIA_GCR2_EXACT_PROOF_PATH_RECOGNITION_SCOPE',
 displayName:'Audralia Gratitude GCR2 four exact proof paths',
 description:'Read-only registration of four individually authorized GCR2 evidence/test paths.',
 repositoryPaths:GCR2_PROOF_PATHS,repositoryOccurrences:OCCURRENCES,
 evidenceClass:GCR2_PROOF_PATH_RECOGNITION_EVIDENCE.evidenceClass,
 evidenceReferences:[EVIDENCE_ID],
 lifecycleStatus:'AUTHORIZED_CANDIDATE_SCOPE_REGISTERED',
 authorityClass:'AUDIT_ONLY',authorityPosture:'EXACT_PATH_RESOLUTION_ONLY',
 registrationEffect:'PATH_RESOLUTION_ONLY',
 authoritySource:['ISSUE_6557','CANONICAL_REGISTRY_ADMISSION_GENERATION_2821',
  'ORIGINAL_GCR2_ADMISSION_GENERATION_2819','SELECTED_NATIVE_PREFLIGHT_39296686857'],
 authorityScope:['EXACT_PATH_RESOLUTION','TRUTHFUL_MAIN_ABSENCE',
  'FROZEN_CANDIDATE_BLOB_IDENTITY','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'],
 authorityLimitations:[
  'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY','NO_PROOF_FILE_MUTATION_AUTHORITY',
  'NO_PREFIX_OR_WILDCARD_AUTHORITY','NO_PREFLIGHT_WAIVER_AUTHORITY',
  'NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY',
  'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
 ],
 parentRelations:[],childRelations:[],peerRelations:[],upstreamBoundaries:[],
 downstreamBoundaries:[],dependencyRelations:[],
 cardinalRole:'NONE',cardinalStatus:'NONE',cardinalCompleteness:'NOT_APPLICABLE',
 allowedMutationScope:'NONE_PATH_RESOLUTION_ONLY',
 unresolvedFields:[]
});
const baseInstance=baseFacade.getHEarthRepositoryRegistryInstance();
const registeredInstance=deepFreeze({
 ...baseInstance,
 nodes:[...baseInstance.nodes.filter(node=>node.nodeId!==NODE_ID),GCR2_PROOF_PATH_RECOGNITION_NODE],
 evidenceRecords:[...(baseInstance.evidenceRecords??[]),GCR2_PROOF_PATH_RECOGNITION_EVIDENCE]
});
export function getHEarthRepositoryRegistryInstance(){return registeredInstance;}
export function getHEarthRepositoryRegistryNode(id){
 return id===NODE_ID?GCR2_PROOF_PATH_RECOGNITION_NODE:baseFacade.getHEarthRepositoryRegistryNode(id);
}
export function getHEarthRepositoryRegistryEvidence(id){
 return id===EVIDENCE_ID?GCR2_PROOF_PATH_RECOGNITION_EVIDENCE:baseFacade.getHEarthRepositoryRegistryEvidence(id);
}
export function resolveHEarthRepositoryRegistryPath(path){
 const normalized=normalizePath(path);
 if(!GCR2_PROOF_PATHS.includes(normalized))
  return baseFacade.resolveHEarthRepositoryRegistryPath(normalized??path);
 const original=baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
 return deepFreeze({...original,repositoryPath:normalized,resolved:true,unresolved:false,
  nodes:[...(original.nodes??[]),GCR2_PROOF_PATH_RECOGNITION_NODE],
  occurrences:[...(original.occurrences??[]),...OCCURRENCES.filter(o=>o.path===normalized)]});
}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){
 const path=input.path==null?null:normalizePath(input.path);
 const original=baseFacade.resolveHEarthRepositoryRegistryOccurrence({
   ...input,...(path===null?{}:{path})
 });
 const matches=OCCURRENCES.filter(o=>
  (path===null||o.path===path)&&
  (input.refType==null||o.refType===input.refType)&&
  (input.refName==null||o.refName===input.refName)&&
  (input.commitSha==null||o.commitSha===input.commitSha)&&
  (input.gitBlobSha==null||o.gitBlobSha===input.gitBlobSha)&&
  (input.existenceStatus==null||o.existenceStatus===input.existenceStatus)
 ).map(occurrence=>({nodeId:NODE_ID,node:GCR2_PROOF_PATH_RECOGNITION_NODE,occurrence}));
 return deepFreeze({query:original.query,matches:[...(original.matches??[]),...matches],
  resolved:original.resolved===true||matches.length>0});
}
export function findHEarthRepositoryRegistryNodes(criteria={}){
 const original=baseFacade.findHEarthRepositoryRegistryNodes(criteria);
 const path=criteria.repositoryPath==null?null:normalizePath(criteria.repositoryPath);
 const node=GCR2_PROOF_PATH_RECOGNITION_NODE;
 const matches=(criteria.nodeId==null||criteria.nodeId===NODE_ID)&&
  (path==null||GCR2_PROOF_PATHS.includes(path))&&
  (criteria.nodeType==null||criteria.nodeType===node.nodeType)&&
  (criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&
  (criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&
  (criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus);
 return deepFreeze(matches?[...original,node]:original);
}
export function getHEarthRepositoryRegistryRelationsForNode(id,direction='BOTH'){
 return id===NODE_ID?Object.freeze([]):
  baseFacade.getHEarthRepositoryRegistryRelationsForNode(id,direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(id){
 return id===NODE_ID?deepFreeze({nodeId:id,nodes:[GCR2_PROOF_PATH_RECOGNITION_NODE],
  relations:[],resolved:true}):baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);
}
export function getHEarthRepositoryRegistryDiscoveryDescriptor(){
 return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
}
export function verifyGCR2ProofPathRecognition(){
 const resolutions=GCR2_PROOF_PATHS.map(path=>resolveHEarthRepositoryRegistryPath(path));
 const absent=OCCURRENCES.filter(o=>o.commitSha===GOVERNING_MAIN);
 const present=OCCURRENCES.filter(o=>o.commitSha===FROZEN_GCR2_CANDIDATE);
 const negative=resolveHEarthRepositoryRegistryPath('/h-earth-3d/evidence/audralia-gratitude-gcr2/unrecognized-sibling.json');
 const node=GCR2_PROOF_PATH_RECOGNITION_NODE;
 const baseCount=baseInstance.nodes.length;
 const checks=deepFreeze({
  exactlyFourNonPrefixPaths:GCR2_PROOF_PATHS.length===4&&GCR2_PROOF_PATHS.every(p=>p.startsWith('/h-earth-3d/')&&!p.endsWith('/')),
  exactlyFourResolved:resolutions.every(r=>r.resolved===true&&r.nodes.some(n=>n.nodeId===NODE_ID)),
  allFourTruthfulAbsentAtGoverningMain:absent.length===4&&absent.every(o=>o.existenceStatus==='ABSENT'&&o.gitBlobSha===null&&o.refName===GOVERNING_MAIN),
  allFourExactCandidateBlobsVerified:present.length===4&&present.every(o=>o.existenceStatus==='PRESENT'&&o.gitBlobSha===TARGET_BLOBS[o.path]&&o.refName===FROZEN_GCR2_CANDIDATE),
  exactOccurrenceQueriesResolve:GCR2_PROOF_PATHS.every(path=>resolveHEarthRepositoryRegistryOccurrence({path,commitSha:FROZEN_GCR2_CANDIDATE,existenceStatus:'PRESENT'}).resolved===true),
  noUnregisteredSiblingRecognition:negative.resolved!==true,
  oldRegistryNodesPreserved:registeredInstance.nodes.length===baseCount+1&&baseInstance.nodes.every(x=>registeredInstance.nodes.includes(x)),
  oldIdentityPreserved:registeredInstance.registryId===baseInstance.registryId&&registeredInstance.registryVersion===baseInstance.registryVersion&&registeredInstance.schemaId===baseInstance.schemaId&&registeredInstance.schemaVersion===baseInstance.schemaVersion&&registeredInstance.accepted===baseInstance.accepted,
  auditOnly:node.authorityClass==='AUDIT_ONLY'&&node.registrationEffect==='PATH_RESOLUTION_ONLY',
  noProductMutation:node.authorityLimitations.includes('NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY'),
  noPrefixOrWildcardRegistration:node.authorityLimitations.includes('NO_PREFIX_OR_WILDCARD_AUTHORITY'),
  noPreflightWaiver:node.authorityLimitations.includes('NO_PREFLIGHT_WAIVER_AUTHORITY'),
  noExperienceAnchorWaiver:node.authorityLimitations.includes('NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY'),
  noPublicationAuthority:node.authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY')
 });
 const eligible=Object.values(checks).every(Boolean);
 return deepFreeze({eligible,status:eligible?'GCR2_EXACT_PATH_REGISTRY_RECOGNITION_PASS':'GCR2_EXACT_PATH_REGISTRY_RECOGNITION_FAIL',
  candidateHead:FROZEN_GCR2_CANDIDATE,governingMain:GOVERNING_MAIN,
  targetPaths:GCR2_PROOF_PATHS,checks});
}
export default deepFreeze({
 ...baseFacade,
 getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,
 getHEarthRepositoryRegistryEvidence,
 resolveHEarthRepositoryRegistryPath,resolveHEarthRepositoryRegistryOccurrence,
 findHEarthRepositoryRegistryNodes,getHEarthRepositoryRegistryRelationsForNode,
 getHEarthRepositoryRegistryDependencyClosure,getHEarthRepositoryRegistryDiscoveryDescriptor
});
