/** Gen2821 Audralia GCR2 exact path recognition only. No product, merge, release or preflight-waiver authority. */
import baseFacade from './h-earth.repository-registry.mountain-traversal-20261006-path-recognition.js';
const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const BASE='92e241f27b79cd50a09e4b0ef8f47e080bc5e0d4';
const CANDIDATE='2dbbd9feafb47078aeacde2579a30d94b648af25';
const NODE_ID='H_EARTH_AUDRALIA_GCR2_FOUR_PROOF_PATH_REGISTRATION_SCOPE';
export const GCR2_PROOF_PATHS=Object.freeze([
 '/h-earth-3d/evidence/audralia-gratitude-gcr2/continuation.json',
 '/h-earth-3d/evidence/audralia-gratitude-gcr2/operation-packet.json',
 '/h-earth-3d/evidence/audralia-gratitude-gcr2/qualification.json',
 '/h-earth-3d/validation/audralia-gratitude-gcr2.v1.test.mjs'
]);
const BLOBS=Object.freeze({
 '/h-earth-3d/evidence/audralia-gratitude-gcr2/continuation.json':'ef7c46d4cdfcf5220f10ecaac26b242672963186',
 '/h-earth-3d/evidence/audralia-gratitude-gcr2/operation-packet.json':'857f6e40c62c57df6fd7bac4b0c2a02efb4e8cb3',
 '/h-earth-3d/evidence/audralia-gratitude-gcr2/qualification.json':'6ae0843989d2c349d189f0ae87c9fc137419ef64',
 '/h-earth-3d/validation/audralia-gratitude-gcr2.v1.test.mjs':'7785b6b3aef1d6c442d80e67764b2fd56c65429a'
});
const freeze=(v,seen=new WeakSet())=>{if(v===null||typeof v!=='object'||seen.has(v))return v;seen.add(v);Object.values(v).forEach(x=>freeze(x,seen));return Object.isFrozen(v)?v:Object.freeze(v);};
const pathOf=x=>{if(typeof x!=='string')return null;let s=x.trim().replaceAll('\\','/');if(s.startsWith('./'))s=s.slice(2);if(!s.startsWith('/'))s='/'+s;s=s.replace(/\/{2,}/g,'/');return s.length>1&&s.endsWith('/')?s.slice(0,-1):s;};
const ABSENT=freeze(GCR2_PROOF_PATHS.map(path=>({repository:REPOSITORY,refType:'COMMIT',refName:BASE,commitSha:BASE,path,gitBlobSha:null,contentSha256:null,byteCount:null,existenceStatus:'ABSENT',fetchbackStatus:'VERIFIED_ABSENT_AT_EXACT_GOVERNING_MAIN',occurrenceClass:'GCR2_AUTHORIZED_PROOF_PATH_ABSENT_AT_BASE'})));
const PRESENT=freeze(GCR2_PROOF_PATHS.map(path=>({repository:REPOSITORY,refType:'COMMIT',refName:CANDIDATE,commitSha:CANDIDATE,path,gitBlobSha:BLOBS[path],contentSha256:null,byteCount:null,existenceStatus:'PRESENT',fetchbackStatus:'VERIFIED_PRESENT_AT_EXACT_FROZEN_CANDIDATE',occurrenceClass:'GCR2_EXACT_CANDIDATE_PROOF_PATH'})));
const OCCURRENCES=freeze([...ABSENT,...PRESENT]);
export const GCR2_PROOF_PATH_NODE=freeze({
 nodeId:NODE_ID,nodeType:'BOUNDARY_PACKET',nodeSubtype:'GCR2_EXACT_FOUR_PROOF_PATHS',
 displayName:'Audralia GCR2 exact four-path registry recognition',
 description:'Audit-only exact source and validation path resolution; no expansion of Gen2819',
 repositoryPaths:GCR2_PROOF_PATHS,repositoryOccurrences:OCCURRENCES,
 lifecycleStatus:'CANDIDATE_PATH_RECOGNITION',authorityClass:'AUDIT_ONLY',
 authorityPosture:'EXACT_PATH_RESOLUTION_ONLY',registrationEffect:'PATH_RESOLUTION_ONLY',
 authoritySource:['ISSUE_6557','CANONICAL_REGISTRY_LOCK_GENERATION_2821','BASE='+BASE,'GCR2='+CANDIDATE],
 authorityScope:['EXACT_PATH_RESOLUTION','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'],
 authorityLimitations:['NO_PREFIX_WIDE_REGISTRATION','NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY','NO_GCR2_SOURCE_OR_EVIDENCE_MUTATION_AUTHORITY','NO_CANONICALIZATION_AUTHORITY','NO_PREFLIGHT_WAIVER_AUTHORITY','NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'],
 parentRelations:[],childRelations:[],peerRelations:[],upstreamBoundaries:[],downstreamBoundaries:[],dependencyRelations:[],
 cardinalRole:'NONE',cardinalStatus:'NONE',cardinalCompleteness:'NOT_APPLICABLE',
 allowedMutationScope:'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION',unresolvedFields:[]
});
const oldInstance=baseFacade.getHEarthRepositoryRegistryInstance();
if(oldInstance.nodes.some(x=>x.nodeId===NODE_ID))throw Error('DUPLICATE_REGISTRY_NODE');
const instance=freeze({...oldInstance,nodes:[...oldInstance.nodes,GCR2_PROOF_PATH_NODE]});
export function getHEarthRepositoryRegistryInstance(){return instance;}
export function getHEarthRepositoryRegistryNode(id){return id===NODE_ID?GCR2_PROOF_PATH_NODE:baseFacade.getHEarthRepositoryRegistryNode(id);}
export function getHEarthRepositoryRegistryEvidence(id){return baseFacade.getHEarthRepositoryRegistryEvidence(id);}
export function resolveHEarthRepositoryRegistryPath(raw){
 const path=pathOf(raw);if(!GCR2_PROOF_PATHS.includes(path))return baseFacade.resolveHEarthRepositoryRegistryPath(path??raw);
 const prior=baseFacade.resolveHEarthRepositoryRegistryPath(path);
 return freeze({...prior,repositoryPath:path,resolved:true,unresolved:false,
   nodes:[...(prior.nodes??[]),GCR2_PROOF_PATH_NODE],
   occurrences:[...(prior.occurrences??[]),...OCCURRENCES.filter(x=>x.path===path)]});
}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){
 const path=input.path==null?null:pathOf(input.path);
 const base=baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input,...(path==null?{}:{path})});
 const matches=OCCURRENCES.filter(x=>(path==null||x.path===path)&&(input.commitSha==null||x.commitSha===input.commitSha)&&(input.refName==null||x.refName===input.refName)&&(input.refType==null||x.refType===input.refType)&&(input.existenceStatus==null||x.existenceStatus===input.existenceStatus)&&(input.gitBlobSha==null||x.gitBlobSha===input.gitBlobSha));
 return freeze({query:base.query,matches:[...(base.matches??[]),...matches.map(occurrence=>({nodeId:NODE_ID,node:GCR2_PROOF_PATH_NODE,occurrence}))],resolved:base.resolved===true||matches.length>0});
}
export function findHEarthRepositoryRegistryNodes(criteria={}){
 const found=baseFacade.findHEarthRepositoryRegistryNodes(criteria),path=criteria.repositoryPath==null?null:pathOf(criteria.repositoryPath),n=GCR2_PROOF_PATH_NODE;
 const match=(criteria.nodeId==null||criteria.nodeId===NODE_ID)&&(path==null||GCR2_PROOF_PATHS.includes(path))&&(criteria.nodeType==null||criteria.nodeType===n.nodeType)&&(criteria.nodeSubtype==null||criteria.nodeSubtype===n.nodeSubtype)&&(criteria.authorityClass==null||criteria.authorityClass===n.authorityClass)&&(criteria.lifecycleStatus==null||criteria.lifecycleStatus===n.lifecycleStatus);
 return freeze(match?[...found,n]:found);
}
export function getHEarthRepositoryRegistryRelationsForNode(id,direction='BOTH'){return id===NODE_ID?freeze([]):baseFacade.getHEarthRepositoryRegistryRelationsForNode(id,direction);}
export function getHEarthRepositoryRegistryDependencyClosure(id){return id===NODE_ID?freeze({nodeId:id,nodes:[GCR2_PROOF_PATH_NODE],relations:[],resolved:true}):baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);}
export function getHEarthRepositoryRegistryDiscoveryDescriptor(){return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();}
export function verifyGCR2ProofPathRecognition(){
 const checks=freeze({
  exactlyFour:GCR2_PROOF_PATHS.length===4&&new Set(GCR2_PROOF_PATHS).size===4,
  allFourResolve:GCR2_PROOF_PATHS.every(path=>resolveHEarthRepositoryRegistryPath(path).resolved),
  baseAbsencePreserved:ABSENT.length===4&&ABSENT.every(x=>x.gitBlobSha===null&&x.commitSha===BASE&&x.existenceStatus==='ABSENT'),
  frozenCandidateBlobs:PRESENT.length===4&&PRESENT.every(x=>x.existenceStatus==='PRESENT'&&x.commitSha===CANDIDATE&&BLOBS[x.path]===x.gitBlobSha),
  exactEightOccurrences:OCCURRENCES.length===8,
  noWildcard:GCR2_PROOF_PATHS.every(x=>x.startsWith('/h-earth-3d/')&&!x.includes('*')),
  neighborNotRecognized:!resolveHEarthRepositoryRegistryPath('/h-earth-3d/evidence/audralia-gratitude-gcr2/neighbor-not-authorized.json').resolved,
  previousRegistryIdentityPreserved:instance.registryId===oldInstance.registryId&&instance.registryVersion===oldInstance.registryVersion&&instance.nodes.length===oldInstance.nodes.length+1,
  auditOnly:GCR2_PROOF_PATH_NODE.authorityClass==='AUDIT_ONLY'&&GCR2_PROOF_PATH_NODE.registrationEffect==='PATH_RESOLUTION_ONLY',
  noRuntimeOrPublicationAuthority:GCR2_PROOF_PATH_NODE.authorityLimitations.includes('NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY')&&GCR2_PROOF_PATH_NODE.authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY')
 });
 const eligible=Object.values(checks).every(Boolean);
 return freeze({eligible,status:eligible?'GCR2_FOUR_PROOF_PATH_RECOGNITION_PASS':'GCR2_FOUR_PROOF_PATH_RECOGNITION_FAIL',candidate:CANDIDATE,governingHead:BASE,nodeId:NODE_ID,targetPaths:GCR2_PROOF_PATHS,checks});
}
export default Object.freeze({...baseFacade,getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,getHEarthRepositoryRegistryRelationsForNode,getHEarthRepositoryRegistryDependencyClosure,getHEarthRepositoryRegistryDiscoveryDescriptor});
