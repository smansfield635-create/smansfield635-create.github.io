/**
 * H-Earth Gen3383 exact existing validation-test path recognition.
 * Canonical admission: issue #7387, compiled owner comment #6957140932;
 * operation H_EARTH_PR7478_MATERIAL_TEST_EXACT_PATH_RECOGNITION_20261117_001.
 * Read-only path registry identity. No general test exemption, runtime change,
 * acceptance waiver, merge, deployment, or release authority.
 */
import baseFacade from './h-earth.repository-registry.terrain-grass-v2-test-path-recognition.v1.js';

export const GEN3383_EXACT_TEST_PATH =
  '/h-earth-3d/validation/h-earth.east-a-environmental-identity.v1.test.mjs';
export const GEN3383_FROZEN_CANDIDATE =
  '2fe4560b30cd9e46c2af141899eceb0559af5806';
export const GEN3383_FROZEN_TEST_BLOB =
  'fb72d275eef75eb7cf789d0b80969aaf37f110ce';

const nodeId='H_EARTH_GEN3383_EAST_A_MATERIAL_EXACT_TEST_PATH';
const normalize=value=>typeof value!=='string'?null:
  ('/'+value.trim().replaceAll('\\','/').replace(/^\/+/,'')).replace(/\/+/g,'/');
const occurrence=Object.freeze({
  repository:'smansfield635-create/smansfield635-create.github.io',
  refType:'COMMIT',refName:GEN3383_FROZEN_CANDIDATE,
  commitSha:GEN3383_FROZEN_CANDIDATE,path:GEN3383_EXACT_TEST_PATH,
  contentSha256:null,byteCount:null,existenceStatus:'PRESENT',
  fetchbackStatus:'VERIFIED_PRESENT_AT_GOVERNING_MAIN',
  occurrenceClass:'EXISTING_VALIDATION_TEST_AT_GOVERNING_MAIN'
});
const node=Object.freeze({
  nodeId,nodeType:'BOUNDARY_PACKET',
  nodeSubtype:'EXACT_EXISTING_VALIDATION_TEST_PATH',
  displayName:'Gen3383 environmental-identity material exact test path',
  description:'One exact test path; no prefix-wide registration or test acceptance',
  repositoryPaths:Object.freeze([GEN3383_EXACT_TEST_PATH]),
  repositoryOccurrences:Object.freeze([occurrence]),
  evidenceClass:'CANONICAL_OWNER_ADMISSION_AND_FROZEN_PR_SOURCE',
  evidenceReferences:Object.freeze([]),
  lifecycleStatus:'CANDIDATE_PATH_RECOGNITION',
  authorityClass:'AUDIT_ONLY',authorityPosture:'PATH_RESOLUTION_ONLY',
  registrationEffect:'PATH_RESOLUTION_ONLY',
  authoritySource:Object.freeze([
    'GEN3383_CANONICAL_INTAKE',
    'ISSUE_7387_COMMENT_6957140932'
  ]),
  authorityScope:Object.freeze(['EXACT_TEST_PATH_RESOLUTION','READ_ONLY_PREFLIGHT']),
  authorityLimitations:Object.freeze([
    'NO_PREFIX_WIDE_TEST_REGISTRATION',
    'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
    'NO_TEST_ASSERTION_WEAKENING',
    'NO_PREFLIGHT_OR_EXPERIENCE_ANCHOR_WAIVER',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ]),
  parentRelations:Object.freeze([]),childRelations:Object.freeze([]),
  peerRelations:Object.freeze([]),upstreamBoundaries:Object.freeze([]),
  downstreamBoundaries:Object.freeze([]),dependencyRelations:Object.freeze([]),
  cardinalRole:'NONE',cardinalStatus:'NONE',cardinalCompleteness:'NOT_APPLICABLE',
  orderingRules:Object.freeze([]),allowedMutationScope:'NONE_PATH_RECOGNITION_ONLY',
  prohibitedMutations:Object.freeze([]),
  requiredValidations:Object.freeze(['EXACT_PATH_POSITIVE','NEIGHBOR_PATH_NEGATIVE']),
  stoppingBoundaries:Object.freeze(['NO_ANCHOR_BYPASS','NO_RELEASE_AUTHORITY']),
  currentIdentityReferences:Object.freeze([
    'GOVERNING_MAIN=2fe4560b30cd9e46c2af141899eceb0559af5806',
    'TEST_REFERENCE_COMMIT='+GEN3383_FROZEN_CANDIDATE,
    'TEST_BLOB='+GEN3383_FROZEN_TEST_BLOB,
    'PR7478_PRODUCT_HEAD=840d2800d058c4234adc9c73e65a0129f82b5c94',
    'LOCK_GENERATION=3383'
  ]),
  unresolvedFields:Object.freeze([])
});

export function getHEarthRepositoryRegistryInstance(){
  const old=baseFacade.getHEarthRepositoryRegistryInstance();
  return Object.freeze({...old,nodes:Object.freeze([...old.nodes,node])});
}
export function getHEarthRepositoryRegistryNode(id){
  return id===nodeId?node:baseFacade.getHEarthRepositoryRegistryNode(id);
}
export function getHEarthRepositoryRegistryEvidence(id){
  return baseFacade.getHEarthRepositoryRegistryEvidence(id);
}
export function resolveHEarthRepositoryRegistryPath(path){
  const prior=baseFacade.resolveHEarthRepositoryRegistryPath(path);
  if(normalize(path)!==GEN3383_EXACT_TEST_PATH||prior.resolved===true)return prior;
  return Object.freeze({
    ...prior,repositoryPath:GEN3383_EXACT_TEST_PATH,resolved:true,unresolved:false,
    nodes:Object.freeze([...(prior.nodes??[]),node]),
    occurrences:Object.freeze([...(prior.occurrences??[]),occurrence])
  });
}
export function resolveHEarthRepositoryRegistryOccurrence(query={}){
  const prior=baseFacade.resolveHEarthRepositoryRegistryOccurrence(query);
  if(normalize(query.path)!==GEN3383_EXACT_TEST_PATH)return prior;
  const match=(query.refType==null||query.refType===occurrence.refType)&&
    (query.refName==null||query.refName===occurrence.refName)&&
    (query.commitSha==null||query.commitSha===occurrence.commitSha)&&
    (query.existenceStatus==null||query.existenceStatus===occurrence.existenceStatus);
  return match?Object.freeze({
    ...prior,resolved:true,
    matches:Object.freeze([...(prior.matches??[]),
      Object.freeze({nodeId,node,occurrence})])
  }):prior;
}
export function findHEarthRepositoryRegistryNodes(criteria={}){
  const old=baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const eligible=(criteria.nodeId==null||criteria.nodeId===nodeId)&&
    (criteria.repositoryPath==null||normalize(criteria.repositoryPath)===GEN3383_EXACT_TEST_PATH)&&
    (criteria.nodeType==null||criteria.nodeType===node.nodeType)&&
    (criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&
    (criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&
    (criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus);
  return Object.freeze(eligible?[...old,node]:[...old]);
}
export function getHEarthRepositoryRegistryRelationsForNode(id,direction='BOTH'){
  return id===nodeId?Object.freeze([]):
    baseFacade.getHEarthRepositoryRegistryRelationsForNode(id,direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(id){
  return id===nodeId?Object.freeze({
    nodeId,nodes:Object.freeze([node]),relations:Object.freeze([]),resolved:true
  }):baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);
}
export function getHEarthRepositoryRegistryDiscoveryDescriptor(){
  return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
}
export default Object.freeze({
  ...baseFacade,getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  getHEarthRepositoryRegistryDiscoveryDescriptor
});
