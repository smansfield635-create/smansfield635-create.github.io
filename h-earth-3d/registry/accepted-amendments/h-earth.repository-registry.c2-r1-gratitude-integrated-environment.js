/**
 * H_EARTH_REPOSITORY_REGISTRY_C2_R1_GRATITUDE_INTEGRATED_ENVIRONMENT_v1
 *
 * Audit-only integrated facade. It records that the frozen C2-R1 coastal
 * candidate remains a member of the already existing Gratitude starting
 * environment. It does not modify either member node and creates no mutation,
 * authority-transfer, product, merge, publication, or execution authority.
 *
 * The C2-R1 candidate source is intentionally supplied runner-locally from the
 * frozen candidate checkout before this facade is loaded by MC5.
 */
import gratitudeFacade, {
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_SCOPE_NODE as GRATITUDE_NODE
} from './h-earth.repository-registry.gratitude-region-final-spatial-placement-disposition.js';
import candidateFacade, {
  H_EARTH_C2_R1_CANDIDATE_PATH_NODE as C2_R1_NODE,
  H_EARTH_C2_R1_CANDIDATE_EXACT_PATHS as C2_R1_COASTAL_PATHS
} from './h-earth.repository-registry.c2-r1-candidate-path-disposition.js';

const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);Object.values(value).forEach(nested=>freeze(nested,seen));return Object.freeze(value)};
const normalize=value=>{if(typeof value!=='string')return null;let result=value.trim().replaceAll('\\','/');if(result.startsWith('./'))result=result.slice(2);if(!result.startsWith('/'))result=`/${result}`;result=result.replace(/\/{2,}/g,'/');return result.length>1&&result.endsWith('/')?result.slice(0,-1):result};

const REPOSITORY='smansfield635-create/smansfield635-create.github.io';
const BRANCH='agent/h-earth-c2-r1-material-only-binding-implementation-001';
const HEAD='501505fe66dbeede467240d8c7d93f194f7d10d2';
const CONTROL_PREFIX='/h-earth-3d/control-plane/coastal-morphology/c2-r1/';
const CONTROL_PREFIX_NORMALIZED=normalize(CONTROL_PREFIX);
const RUNTIME_PATHS=Object.freeze([
  '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js'
]);
const RUNTIME_BLOBS=freeze({
  [RUNTIME_PATHS[0]]:'4b1d9e685711478a6d1a314031ac9448c49f78c9',
  [RUNTIME_PATHS[1]]:'2b8103b182cfb5fcee84c94afaecd2a1cf329a7f'
});
const COMPOSITE_PATHS=Object.freeze([CONTROL_PREFIX,...C2_R1_COASTAL_PATHS,...RUNTIME_PATHS]);
const COMPOSITE_NODE_ID='H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT';
const RELATION_IDS=Object.freeze([
  'INTEGRATED_ENVIRONMENT_CONTAINS_GRATITUDE_SPATIAL_DISPOSITION',
  'INTEGRATED_ENVIRONMENT_CONTAINS_C2_R1_COASTAL_COMPONENT'
]);

const controlsPath=repositoryPath=>{
  const normalized=normalize(repositoryPath);
  return normalized!==null&&(
    normalized===CONTROL_PREFIX_NORMALIZED||
    normalized.startsWith(`${CONTROL_PREFIX_NORMALIZED}/`)||
    C2_R1_COASTAL_PATHS.includes(normalized)||
    RUNTIME_PATHS.includes(normalized)
  );
};
const occurrenceFor=repositoryPath=>{
  const normalized=normalize(repositoryPath);
  const path=normalized===CONTROL_PREFIX_NORMALIZED?CONTROL_PREFIX:normalized;
  return freeze({
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
    occurrenceClass:'INTEGRATED_ENVIRONMENT_CURRENT_OCCURRENCE'
  });
};

export const H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_EVIDENCE=freeze({
  evidenceId:'EVIDENCE_H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_v1',
  evidenceClass:'READ_ONLY_EXISTING_SPATIAL_AND_RUNTIME_CONTINUITY_CORRESPONDENCE',
  sourceKind:'FROZEN_CANDIDATE_MEMBER_PLUS_ACCEPTED_GRATITUDE_SPATIAL_DISPOSITION',
  sourceIdOrPath:CONTROL_PREFIX,
  sourceOccurrenceOrRevision:`BRANCH=${BRANCH};HEAD=${HEAD};COAST_ENTRY=X_0_Z_MINUS_96`,
  verifiedOn:'2026-08-02',
  memberNodeIds:Object.freeze([GRATITUDE_NODE.nodeId,C2_R1_NODE.nodeId]),
  continuityAssertion:'COASTAL_ENTRY_IS_MEMBER_OF_THE_EXISTING_GRATITUDE_STARTING_ENVIRONMENT',
  coastEntryCorrespondence:freeze({worldX:0,worldZ:-96,corresponds:true}),
  evidenceLimitations:Object.freeze([
    'NO_AUTHORITY_TRANSFER_OR_INHERITANCE',
    'NO_MUTATION_AUTHORITY_CREATED',
    'NO_MEMBER_NODE_MODIFICATION',
    'NO_PRODUCT_MUTATION',
    'NO_PR_484_MUTATION',
    'NO_CANDIDATE_MUTATION',
    'NO_MERGE_PUBLICATION_PROMOTION_OR_USER_REVIEW'
  ])
});

export const H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_NODE=freeze({
  nodeId:COMPOSITE_NODE_ID,
  nodeType:'COMPOSITE',
  nodeSubtype:'INTEGRATED_ENVIRONMENT_CORRESPONDENCE',
  displayName:'H-Earth C2-R1 Gratitude Continuous Starting Environment',
  description:'Audit-only record that the frozen C2-R1 coastal entry and runtime occurrences remain members of the existing Gratitude starting environment.',
  repositoryPaths:COMPOSITE_PATHS,
  repositoryOccurrences:Object.freeze(COMPOSITE_PATHS.map(occurrenceFor)),
  evidenceClass:'READ_ONLY_EXISTING_SPATIAL_AND_RUNTIME_CONTINUITY_CORRESPONDENCE',
  evidenceReferences:Object.freeze([H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_EVIDENCE.evidenceId]),
  authorityClass:'AUDIT_ONLY',
  authorityPosture:'READ_ONLY_RECORD_OF_ALREADY_EXISTING_SPATIAL_AND_RUNTIME_CONTINUITY',
  authoritySource:Object.freeze([
    GRATITUDE_NODE.nodeId,
    C2_R1_NODE.nodeId,
    `FROZEN_CANDIDATE_HEAD=${HEAD}`
  ]),
  authorityScope:Object.freeze([
    'INTEGRATED_ENVIRONMENT_CORRESPONDENCE_ONLY',
    'READ_ONLY_PATH_AND_OCCURRENCE_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT'
  ]),
  authorityLimitations:Object.freeze([
    'NO_AUTHORITY_TRANSFER_OR_INHERITANCE',
    'NO_MUTATION_AUTHORITY_CREATED',
    'NO_PRODUCT_MUTATION',
    'NO_MEMBER_NODE_MODIFICATION',
    'NO_PR_484_OR_CANDIDATE_MUTATION',
    'NO_MERGE_PUBLICATION_PROMOTION_OR_USER_REVIEW'
  ]),
  parentRelations:Object.freeze([]),
  childRelations:RELATION_IDS,
  peerRelations:Object.freeze([]),
  upstreamBoundaries:Object.freeze([]),
  downstreamBoundaries:Object.freeze([]),
  cardinalRole:'NONE',
  cardinalStatus:'NONE',
  cardinalCompleteness:'NOT_APPLICABLE',
  orderingRules:Object.freeze([
    'ACCEPTED_GRATITUDE_SPATIAL_DISPOSITION_AND_FROZEN_C2_R1_MEMBER_BEFORE_INTEGRATED_CORRESPONDENCE',
    'STATIC_REGISTRY_PASS_BEFORE_BROWSER_EXECUTION'
  ]),
  dependencyRelations:RELATION_IDS,
  allowedMutationScope:'NONE_READ_ONLY_RECORD_ONLY',
  prohibitedMutations:Object.freeze([
    'GRATITUDE_MEMBER_NODE_MUTATION',
    'C2_R1_MEMBER_NODE_MUTATION',
    'PRODUCT_TERRAIN_RENDERER_CAMERA_NAVIGATION_PLACEMENT_ROUTE_PACKAGE_OR_CACHE_MUTATION',
    'AUTHORITY_TRANSFER_OR_INHERITANCE',
    'PR_484_MUTATION',
    'MERGE_OR_WORKFLOW_EXECUTION_WITHOUT_SEPARATE_AUTHORITY'
  ]),
  requiredValidations:Object.freeze([
    'GRATITUDE_NODE_PRESENT',
    'C2_R1_NODE_PRESENT',
    'TWO_MEMBERSHIP_RELATIONS_PRESENT',
    'COAST_ENTRY_CORRESPONDS_TO_X0_Z_MINUS96',
    'ALL_EIGHT_H_EARTH_PATHS_RESOLVED_AT_FROZEN_HEAD',
    'TWO_RUNTIME_PATHS_RESOLVED_AT_FROZEN_HEAD',
    'ZERO_AUTHORITY_TRANSFER',
    'ZERO_PRODUCT_MUTATION'
  ]),
  stoppingBoundaries:Object.freeze([
    'STOP_ON_MEMBER_SOURCE_BLOB_MISMATCH',
    'STOP_ON_FROZEN_BRANCH_OR_HEAD_MISMATCH',
    'STOP_BEFORE_ANY_PRODUCT_OR_MEMBER_MUTATION',
    'STOP_BEFORE_MERGE_OR_WORKFLOW_EXECUTION'
  ]),
  currentIdentityReferences:Object.freeze([
    `BRANCH=${BRANCH}`,
    `HEAD=${HEAD}`,
    'COAST_ENTRY=X_0_Z_MINUS_96',
    GRATITUDE_NODE.nodeId,
    C2_R1_NODE.nodeId
  ]),
  lifecycleStatus:'AUDIT_ONLY_CURRENT_CORRESPONDENCE',
  unresolvedFields:Object.freeze([]),
  coastEntryCorrespondence:freeze({worldX:0,worldZ:-96,corresponds:true})
});

const membershipRelation=(relationId,toNodeId,roleWithinComposite)=>freeze({
  relationId,
  relationType:'CONTAINS',
  fromNodeId:COMPOSITE_NODE_ID,
  toNodeId,
  scale:'INTEGRATED_ENVIRONMENT_TO_MEMBER',
  direction:'FROM_TO',
  evidenceClass:'READ_ONLY_EXISTING_SPATIAL_AND_RUNTIME_CONTINUITY_CORRESPONDENCE',
  evidenceReferences:Object.freeze([H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_EVIDENCE.evidenceId]),
  order:null,
  authorityEffect:'NO_AUTHORITY_TRANSFER_OR_INHERITANCE',
  continuityEffect:'COASTAL_ENTRY_IS_MEMBER_OF_THE_EXISTING_GRATITUDE_STARTING_ENVIRONMENT',
  mutationEffect:'NO_MUTATION_AUTHORITY_CREATED',
  lifecycleStatus:'AUDIT_ONLY_CURRENT_CORRESPONDENCE',
  roleWithinComposite,
  roleStatus:'CURRENT_MEMBER'
});

export const H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_RELATIONS=Object.freeze([
  membershipRelation(RELATION_IDS[0],GRATITUDE_NODE.nodeId,'GRATITUDE_SPATIAL_DISPOSITION_MEMBER'),
  membershipRelation(RELATION_IDS[1],C2_R1_NODE.nodeId,'C2_R1_COASTAL_COMPONENT_MEMBER')
]);

const baseInstance=candidateFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance=freeze({
  ...baseInstance,
  evidenceRecords:[...baseInstance.evidenceRecords,H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_EVIDENCE],
  nodes:[...baseInstance.nodes,H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_NODE],
  relations:[...(baseInstance.relations??[]),...H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_RELATIONS]
});

export const getHEarthRepositoryRegistryInstance=()=>combinedInstance;
export const getHEarthRepositoryRegistryNode=nodeId=>nodeId===COMPOSITE_NODE_ID
  ? H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_NODE
  : candidateFacade.getHEarthRepositoryRegistryNode(nodeId);
export const getHEarthRepositoryRegistryEvidence=evidenceId=>evidenceId===H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_EVIDENCE.evidenceId
  ? H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_EVIDENCE
  : candidateFacade.getHEarthRepositoryRegistryEvidence(evidenceId);

export function resolveHEarthRepositoryRegistryPath(repositoryPath){
  const normalized=normalize(repositoryPath);
  const base=candidateFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  if(!controlsPath(normalized))return base;
  const baseNodes=(base.nodes??[]).filter(node=>node.nodeId!==COMPOSITE_NODE_ID);
  const baseOccurrences=base.occurrences??[];
  return freeze({
    repositoryPath:normalized,
    resolved:true,
    nodes:[...baseNodes,H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_NODE],
    occurrences:[...baseOccurrences,occurrenceFor(normalized)],
    unresolved:false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input={}){
  const base=candidateFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  const normalized=normalize(input.path);
  const local=controlsPath(normalized)&&
    (input.refName==null||input.refName===BRANCH)&&
    (input.commitSha==null||input.commitSha===HEAD)
    ? [freeze({
        nodeId:COMPOSITE_NODE_ID,
        node:H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_NODE,
        occurrence:occurrenceFor(normalized)
      })]
    : [];
  return freeze({query:base.query,matches:[...(base.matches??[]),...local],resolved:base.resolved||local.length>0});
}

export function findHEarthRepositoryRegistryNodes(criteria={}){
  const base=candidateFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node=H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_NODE;
  const matches=(criteria.repositoryPath==null||controlsPath(criteria.repositoryPath))&&
    (criteria.nodeType==null||criteria.nodeType===node.nodeType)&&
    (criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&
    (criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&
    (criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus)&&
    (criteria.cardinalRole==null||criteria.cardinalRole===node.cardinalRole)&&
    (criteria.hasUnresolvedFields==null||criteria.hasUnresolvedFields===false);
  return freeze(matches?[...base,node]:base);
}

export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH'){
  const base=candidateFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction)??[];
  const local=H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_RELATIONS.filter(relation=>{
    if(direction==='OUTBOUND')return relation.fromNodeId===nodeId;
    if(direction==='INBOUND')return relation.toNodeId===nodeId;
    return relation.fromNodeId===nodeId||relation.toNodeId===nodeId;
  });
  return freeze([...base,...local]);
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId){
  if(nodeId!==COMPOSITE_NODE_ID)return candidateFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
  return freeze({
    nodeId,
    nodes:[
      H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_NODE,
      GRATITUDE_NODE,
      C2_R1_NODE
    ],
    relations:H_EARTH_C2_R1_GRATITUDE_CONTINUOUS_STARTING_ENVIRONMENT_RELATIONS,
    unresolved:false
  });
}

export const H_EARTH_C2_R1_GRATITUDE_INTEGRATED_ENVIRONMENT_FACADE=freeze({
  ...candidateFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export { GRATITUDE_NODE as H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_SCOPE_NODE };
export { C2_R1_NODE as H_EARTH_C2_R1_CANDIDATE_PATH_NODE };
export default H_EARTH_C2_R1_GRATITUDE_INTEGRATED_ENVIRONMENT_FACADE;
