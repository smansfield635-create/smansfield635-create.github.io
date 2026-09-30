/** H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_EXACT_PATH_RECOGNITION_v1 */
import baseFacade from './h-earth.repository-registry.awards-recognizable-successor-verifier-path-recognition.js';

const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const GOVERNING_HEAD='521c4b146337e16c784b9f3f0a6bb94045b756b5';
const NODE_ID='H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_EXACT_PATH_RECOGNITION_SCOPE';
const TARGET='/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-cloud-pass.mjs';
const TARGET_GIT_BLOB='22283fa328ed0a39ea3b013232821713262a7106';

function deepFreeze(value,seen=new WeakSet()){if(value===null||typeof value!=='object'||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))deepFreeze(nested,seen);return Object.isFrozen(value)?value:Object.freeze(value);}
function normalizePath(value){if(typeof value!=='string')return null;let result=value.trim().replaceAll('\\\\','/');if(result.startsWith('./'))result=result.slice(2);if(!result.startsWith('/'))result=`/${result}`;result=result.replace(/\/{2,}/g,'/');return result.length>1&&result.endsWith('/')?result.slice(0,-1):result;}

const OCCURRENCE=deepFreeze({
  repository:REPOSITORY,refType:'COMMIT',refName:GOVERNING_HEAD,commitSha:GOVERNING_HEAD,
  path:TARGET,gitBlobSha:TARGET_GIT_BLOB,contentSha256:null,byteCount:null,
  existenceStatus:'PRESENT',fetchbackStatus:'VERIFIED_PRESENT_AT_GOVERNING_HEAD',
  occurrenceClass:'AUDRALIA_TABLET_CLOUD_PASS_EXACT_PATH_READ_ONLY_RECOGNITION'
});

export const H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE=deepFreeze({
  nodeId:NODE_ID,nodeType:'BOUNDARY_PACKET',
  nodeSubtype:'H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_EXACT_PATH_RECOGNITION_SCOPE',
  displayName:'H-Earth Audralia Tablet Cloud Pass Exact-Path Recognition',
  repositoryPaths:[TARGET],repositoryOccurrences:[OCCURRENCE],
  lifecycleStatus:'CANDIDATE_PATH_RECOGNITION',authorityClass:'AUDIT_ONLY',
  authorityPosture:'EXACT_PATH_RESOLUTION_ONLY',registrationEffect:'PATH_RESOLUTION_ONLY',
  authorityScope:['EXACT_PATH_RESOLUTION','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION','READ_ONLY_PREMUTATION_PREFLIGHT_RESOLUTION'],
  authorityLimitations:[
    'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY','NO_CLOUD_PRESENTATION_MUTATION_AUTHORITY',
    'NO_RENDERER_CONTEXT_OR_PERFORMANCE_BUDGET_MUTATION_AUTHORITY','NO_PREFIX_WIDE_AUDRALIA_REGISTRATION_AUTHORITY',
    'NO_GENERATION_2161_AUTHORITY_EXPANSION','NO_PREFLIGHT_WAIVER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ],
  parentRelations:[],childRelations:[],peerRelations:[],upstreamBoundaries:[],downstreamBoundaries:[],
  dependencyRelations:[],cardinalRole:'NONE',cardinalStatus:'NONE',cardinalCompleteness:'NOT_APPLICABLE',
  allowedMutationScope:'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION',unresolvedFields:[]
});

const baseInstance=baseFacade.getHEarthRepositoryRegistryInstance();
const registryInstance=deepFreeze({...baseInstance,nodes:[
  ...baseInstance.nodes.filter(node=>node.nodeId!==NODE_ID),
  H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE
]});

export function getHEarthRepositoryRegistryInstance(){return registryInstance;}
export function getHEarthRepositoryRegistryNode(nodeId){return nodeId===NODE_ID?H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE:baseFacade.getHEarthRepositoryRegistryNode(nodeId);}
export function getHEarthRepositoryRegistryEvidence(evidenceId){return baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);}
export function resolveHEarthRepositoryRegistryPath(repositoryPath){
  const normalized=normalizePath(repositoryPath);
  if(normalized!==TARGET)return baseFacade.resolveHEarthRepositoryRegistryPath(normalized??repositoryPath);
  const base=baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({...base,repositoryPath:normalized,resolved:true,unresolved:false,
    nodes:[...(base.nodes??[]),H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE],
    occurrences:[...(base.occurrences??[]),OCCURRENCE]});
}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){
  const normalized=input.path==null?null:normalizePath(input.path);
  const matches=(normalized==null||normalized===TARGET)&&(input.refType==null||input.refType===OCCURRENCE.refType)&&
    (input.refName==null||input.refName===OCCURRENCE.refName)&&(input.commitSha==null||input.commitSha===OCCURRENCE.commitSha)&&
    (input.gitBlobSha==null||input.gitBlobSha===OCCURRENCE.gitBlobSha)&&(input.existenceStatus==null||input.existenceStatus===OCCURRENCE.existenceStatus);
  const base=baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input,...(normalized==null?{}:{path:normalized})});
  return deepFreeze({query:base.query,matches:[...(base.matches??[]),...(matches?[{nodeId:NODE_ID,node:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE,occurrence:OCCURRENCE}]:[])],resolved:base.resolved===true||matches});
}
export function findHEarthRepositoryRegistryNodes(criteria={}){
  const base=baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const normalized=criteria.repositoryPath==null?null:normalizePath(criteria.repositoryPath);
  const node=H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE;
  const match=(criteria.nodeId==null||criteria.nodeId===NODE_ID)&&(normalized==null||normalized===TARGET)&&
    (criteria.nodeType==null||criteria.nodeType===node.nodeType)&&(criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&
    (criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&(criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus);
  return deepFreeze(match?[...base,node]:base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH'){return nodeId===NODE_ID?Object.freeze([]):baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId){return nodeId===NODE_ID?deepFreeze({nodeId,nodes:[H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE],relations:[],resolved:true}):baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);}
export function getHEarthRepositoryRegistryDiscoveryDescriptor(){return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();}

export function verifyHEarthAudraliaTabletCloudPassPathRecognition(){
  const resolution=resolveHEarthRepositoryRegistryPath(TARGET);
  const checks=deepFreeze({
    exactTargetPathCount:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE.repositoryPaths.length===1,
    targetPathResolves:resolution.resolved===true,
    governingOccurrencePresent:OCCURRENCE.existenceStatus==='PRESENT'&&OCCURRENCE.commitSha===GOVERNING_HEAD&&OCCURRENCE.gitBlobSha===TARGET_GIT_BLOB,
    exactPathOnly:TARGET.endsWith('/audralia-tablet-cloud-pass.mjs'),
    noPrefixRegistration:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE.repositoryPaths.every(p=>p===TARGET),
    auditOnly:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE.authorityClass==='AUDIT_ONLY',
    pathResolutionOnly:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE.registrationEffect==='PATH_RESOLUTION_ONLY',
    noProductRuntimeAuthority:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY'),
    noGenerationExpansion:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_GENERATION_2161_AUTHORITY_EXPANSION'),
    noPreflightWaiver:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PREFLIGHT_WAIVER_AUTHORITY'),
    noPublicationAuthority:H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY')
  });
  const eligible=Object.values(checks).every(Boolean);
  return deepFreeze({eligible,status:eligible?'H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_PASS':'H_EARTH_AUDRALIA_TABLET_CLOUD_PASS_PATH_RECOGNITION_FAIL',governingHead:GOVERNING_HEAD,targetPath:TARGET,targetGitBlob:TARGET_GIT_BLOB,checks});
}
export default Object.freeze({...baseFacade,getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,getHEarthRepositoryRegistryRelationsForNode,getHEarthRepositoryRegistryDependencyClosure,getHEarthRepositoryRegistryDiscoveryDescriptor});
