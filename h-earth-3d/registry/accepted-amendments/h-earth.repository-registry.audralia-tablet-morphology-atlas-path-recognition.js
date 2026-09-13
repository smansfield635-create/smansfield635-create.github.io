/** H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_EXACT_PATH_RECOGNITION_v1 */
import baseFacade from './h-earth.repository-registry.audralia-tablet-single-context-runtime-path-recognition.js';

const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const GOVERNING_MAIN='57e81ded57a4a0e9c4c3de22ca4de1d91dae52e9';
const FROZEN_CANDIDATE='adc18db3bc3da9ad1928f88b6f83e6ae3b7f7b3d';
const CANDIDATE_BLOB='a6434818b083036cee6a346395a47e6cc744229c';
const TARGET='/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-weather-morphology-atlas-v1.mjs';
const NODE_ID='H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_EXACT_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID='EVIDENCE_H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_v1';

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
  fetchbackStatus:'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_FROZEN_CANDIDATE',
  occurrenceClass:'AUTHORIZED_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_TARGET_NOT_PRESENT_AT_GOVERNING_MAIN'
});

export const H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_EVIDENCE=deepFreeze({
  evidenceId:EVIDENCE_ID,
  evidenceClass:'H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_WITH_TRUTHFUL_ABSENT_OCCURRENCE',
  sourceKind:'FROZEN_CANDIDATE_AUTOMATIC_PREFLIGHT_STOP_PLUS_EXACT_GIT_OBJECT_IDENTITY',
  sourceIdOrPath:'ISSUE_3268',
  governingMain:GOVERNING_MAIN,
  frozenCandidate:FROZEN_CANDIDATE,
  candidateBlob:CANDIDATE_BLOB,
  targetPath:TARGET,
  registrationEffect:'PATH_RESOLUTION_ONLY',
  evidenceLimitations:[
    'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
    'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PREFLIGHT_WAIVER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ]
});

export const H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE=deepFreeze({
  nodeId:NODE_ID,
  nodeType:'BOUNDARY_PACKET',
  nodeSubtype:'H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_EXACT_PATH_RECOGNITION_SCOPE',
  displayName:'H-Earth Audralia Tablet Morphology Atlas Exact-Path Recognition',
  description:'Read-only exact-path recognition for the candidate-created constrained-tablet morphology atlas required by automatic H-Earth repository preflight.',
  repositoryPaths:[TARGET],
  repositoryOccurrences:[OCCURRENCE],
  evidenceClass:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences:[EVIDENCE_ID],
  lifecycleStatus:'CANDIDATE_PATH_RECOGNITION',
  authorityClass:'AUDIT_ONLY',
  authorityPosture:'EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect:'PATH_RESOLUTION_ONLY',
  authoritySource:['ISSUE_3268','CANONICAL_LOCK_GENERATION_2193',`EXACT_GOVERNING_MAIN=${GOVERNING_MAIN}`,`FROZEN_CANDIDATE=${FROZEN_CANDIDATE}`,`CANDIDATE_BLOB=${CANDIDATE_BLOB}`],
  authorityScope:['EXACT_PATH_RESOLUTION','TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'],
  authorityLimitations:[
    'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
    'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
    'NO_PREFIX_WIDE_AUDRALIA_REGISTRATION_AUTHORITY',
    'NO_PREFLIGHT_WAIVER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ],
  parentRelations:[],childRelations:[],peerRelations:[],upstreamBoundaries:[],downstreamBoundaries:[],dependencyRelations:[],
  cardinalRole:'NONE',cardinalStatus:'NONE',cardinalCompleteness:'NOT_APPLICABLE',
  allowedMutationScope:'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION',
  unresolvedFields:[]
});

const baseInstance=baseFacade.getHEarthRepositoryRegistryInstance();
const registryInstance=deepFreeze({
  ...baseInstance,
  evidenceRecords:[...(baseInstance.evidenceRecords??[]),H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_EVIDENCE],
  nodes:[...baseInstance.nodes.filter(node=>node.nodeId!==NODE_ID),H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE]
});

export function getHEarthRepositoryRegistryInstance(){return registryInstance;}
export function getHEarthRepositoryRegistryNode(nodeId){return nodeId===NODE_ID?H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE:baseFacade.getHEarthRepositoryRegistryNode(nodeId);}
export function getHEarthRepositoryRegistryEvidence(evidenceId){return evidenceId===EVIDENCE_ID?H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_EVIDENCE:baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);}
export function resolveHEarthRepositoryRegistryPath(repositoryPath){
  const normalized=normalizePath(repositoryPath);
  if(normalized!==TARGET)return baseFacade.resolveHEarthRepositoryRegistryPath(normalized??repositoryPath);
  const base=baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({...base,repositoryPath:normalized,resolved:true,unresolved:false,
    nodes:[...(base.nodes??[]),H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE],
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
  return deepFreeze({query:base.query,matches:[...(base.matches??[]),...(matches?[{nodeId:NODE_ID,node:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE,occurrence:OCCURRENCE}]:[])],resolved:base.resolved===true||matches});
}
export function findHEarthRepositoryRegistryNodes(criteria={}){
  const base=baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const normalized=criteria.repositoryPath==null?null:normalizePath(criteria.repositoryPath);
  const node=H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE;
  const match=(criteria.nodeId==null||criteria.nodeId===NODE_ID)&&
    (normalized==null||normalized===TARGET)&&
    (criteria.nodeType==null||criteria.nodeType===node.nodeType)&&
    (criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&
    (criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&
    (criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus);
  return deepFreeze(match?[...base,node]:base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH'){return nodeId===NODE_ID?Object.freeze([]):baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId){return nodeId===NODE_ID?deepFreeze({nodeId,nodes:[H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE],relations:[],resolved:true}):baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);}
export function getHEarthRepositoryRegistryDiscoveryDescriptor(){return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();}

export function verifyHEarthAudraliaTabletMorphologyAtlasPathRecognition(){
  const resolution=resolveHEarthRepositoryRegistryPath(TARGET);
  const prefixResolution=resolveHEarthRepositoryRegistryPath('/showroom/globe/h-earth/terrain-estate-construction-v1/');
  const checks=deepFreeze({
    exactTargetPathCount:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE.repositoryPaths.length===1,
    targetPathResolves:resolution.resolved===true,
    truthfulAbsentAtMain:OCCURRENCE.commitSha===GOVERNING_MAIN&&OCCURRENCE.existenceStatus==='ABSENT'&&OCCURRENCE.gitBlobSha===null,
    frozenCandidateBound:FROZEN_CANDIDATE==='adc18db3bc3da9ad1928f88b6f83e6ae3b7f7b3d',
    candidateBlobBound:CANDIDATE_BLOB==='a6434818b083036cee6a346395a47e6cc744229c',
    exactPathOnly:TARGET.endsWith('/audralia-tablet-weather-morphology-atlas-v1.mjs'),
    noPrefixRegistration:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE.repositoryPaths.every(path=>path===TARGET)&&!(prefixResolution.nodes??[]).some(node=>node.nodeId===NODE_ID),
    auditOnly:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE.authorityClass==='AUDIT_ONLY',
    pathResolutionOnly:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE.registrationEffect==='PATH_RESOLUTION_ONLY',
    noProductRuntimeAuthority:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY'),
    noPreflightWaiver:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PREFLIGHT_WAIVER_AUTHORITY'),
    noPublicationAuthority:H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY')
  });
  const eligible=Object.values(checks).every(Boolean);
  return deepFreeze({eligible,status:eligible?'H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_PASS':'H_EARTH_AUDRALIA_TABLET_MORPHOLOGY_ATLAS_PATH_RECOGNITION_FAIL',governingMain:GOVERNING_MAIN,frozenCandidate:FROZEN_CANDIDATE,candidateBlob:CANDIDATE_BLOB,targetPath:TARGET,checks});
}

export default Object.freeze({...baseFacade,getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,getHEarthRepositoryRegistryRelationsForNode,getHEarthRepositoryRegistryDependencyClosure,getHEarthRepositoryRegistryDiscoveryDescriptor});
