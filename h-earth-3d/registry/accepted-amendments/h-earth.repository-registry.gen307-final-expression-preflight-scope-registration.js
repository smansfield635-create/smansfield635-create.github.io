/**
 * H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_REGISTRATION_v1
 * Read-only registry successor for the two Gen307 final-expression paths that
 * are authorized by canonical lock generation 307 but intentionally absent
 * from the frozen qualified Gen306 public construction parent.
 */
import baseFacade from './h-earth.repository-registry.gen306-world-manifold-preflight-scope-registration.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

const normalizePath = (value) => {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const TOOLING_PREDECESSOR_HEAD = '46b2cca200f1db036cae8288329f870a8336505a';
const FROZEN_PUBLIC_BASE = 'dbf2f3ec90faa59c09193e61a0d141481b68d758';
const PRIVATE_GOVERNING_HEAD = 'd6376bffa66fd2df97b731a6423576192d56f5f3';
const LOCK_GENERATION = 307;
const OPERATION_ID = 'H_EARTH_GRATITUDE_AUDRALIA_FINAL_SUBTROPICAL_CONTINENTAL_EXPRESSION_20260817_001';
const NODE_ID = 'H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_REGISTRATION';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_REGISTRATION_v1';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gen307-final-expression-preflight-scope-registration.js';

export const H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_TARGET_PATHS = Object.freeze([
  '/h-earth-3d/docs/H_EARTH_GRATITUDE_AUDRALIA_FINAL_SUBTROPICAL_CONTINENTAL_EXPRESSION_SUCCESSOR_CONTRACT_v1.md',
  '/h-earth-3d/validation/h-earth.gratitude-audralia-final-expression.harness.mjs'
]);
export const H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_REGISTERED_PATHS = Object.freeze([...H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_TARGET_PATHS, AMENDMENT_PATH]);

const targetOccurrences = H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_TARGET_PATHS.map((path) => deepFreeze({
  repository: REPOSITORY, refType: 'COMMIT', refName: FROZEN_PUBLIC_BASE, commitSha: FROZEN_PUBLIC_BASE, path,
  gitBlobSha: null, contentSha256: null, byteCount: null, existenceStatus: 'ABSENT',
  fetchbackStatus: 'VERIFIED_NOT_MATERIALIZED_IN_FROZEN_GEN306_QUALIFIED_PARENT_BEFORE_GEN307_CONSTRUCTION',
  occurrenceClass: 'GEN307_AUTHORIZED_FUTURE_PATH_NOT_YET_MATERIALIZED'
}));
const OCCURRENCES = Object.freeze([
  ...targetOccurrences,
  deepFreeze({repository:REPOSITORY,refType:'COMMIT',refName:TOOLING_PREDECESSOR_HEAD,commitSha:TOOLING_PREDECESSOR_HEAD,path:AMENDMENT_PATH,gitBlobSha:null,contentSha256:null,byteCount:null,existenceStatus:'ABSENT',fetchbackStatus:'VERIFIED_ABSENT_AT_PREDECESSOR_TOOLING_HEAD_BEFORE_GEN307_SCOPE_REPAIR',occurrenceClass:'REGISTRY_REPAIR_SELF_PATH_NOT_YET_MATERIALIZED_AT_PREDECESSOR'})
]);

export const H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_EVIDENCE = deepFreeze({
  evidenceId:EVIDENCE_ID,
  evidenceClass:'AUTHORIZED_FUTURE_PATH_SCOPE_WITH_TRUTHFUL_ABSENT_OCCURRENCE_STATE',
  sourceKind:'CANONICAL_GEN307_LOCK_ROUTER_AND_NATIVE_PREFLIGHT_UNRESOLVED_PATH_RECEIPT',
  sourceIdOrPath:'PRIVATE_ISSUE_277_AND_PUBLIC_CALLBACK_ISSUE_1274',
  sourceOccurrenceOrRevision:`PRIVATE_HEAD=${PRIVATE_GOVERNING_HEAD};LOCK_GENERATION=${LOCK_GENERATION};OPERATION=${OPERATION_ID};PUBLIC_BASE=${FROZEN_PUBLIC_BASE};TOOLING_PREDECESSOR=${TOOLING_PREDECESSOR_HEAD};ROUTER_RUN=32085260786;NATIVE_PREFLIGHT_RUN=32085360964`,
  exactTargetPathCount:2,
  registrationEffect:'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope:Object.freeze(['EXACT_TWO_GEN307_FINAL_EXPRESSION_FUTURE_PATHS','TRUTHFUL_ABSENCE_AT_FROZEN_GEN306_QUALIFIED_PARENT','NATIVE_PREFLIGHT_REQUESTED_PATH_UNRESOLVED_REPAIR_ONLY','NO_PRODUCT_BYTE_MATERIALIZATION']),
  evidenceLimitations:Object.freeze(['NO_PREFIX_WIDE_REGISTRATION','NO_PRODUCT_MUTATION_AUTHORITY','NO_CONSTRUCTION_AUTHORITY_CREATED_BY_REGISTRY','NO_GEOGRAPHY_NAVIGATION_RENDERER_OR_DEPLOYMENT_AUTHORITY','NO_MERGE_RELEASE_OR_PUBLICATION_AUTHORITY'])
});

export const H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE = deepFreeze({
  nodeId:NODE_ID,nodeType:'BOUNDARY_PACKET',nodeSubtype:'GEN307_AUTHORIZED_FUTURE_FINAL_EXPRESSION_PATH_PREFLIGHT_SCOPE',
  displayName:'H-Earth Gen307 Final Expression Preflight Scope Registration',
  description:'Registers exactly the two Gen307 final-expression future paths for repository-registry preflight resolution while preserving truthful absence before construction.',
  repositoryPaths:[...H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_REGISTERED_PATHS],repositoryOccurrences:OCCURRENCES,
  evidenceClass:H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_EVIDENCE.evidenceClass,evidenceReferences:Object.freeze([EVIDENCE_ID]),
  lifecycleStatus:'AUTHORIZED_FUTURE_SCOPE_REGISTERED',authorityClass:'AUDIT_ONLY',authorityPosture:'PATH_RESOLUTION_ONLY',registrationEffect:'PATH_RESOLUTION_AUTHORITY_ONLY',
  authoritySource:Object.freeze(['GEN307_LOCK_GENERATION_307',OPERATION_ID,'GEN307_EXACT_ELEVEN_PATH_MUTATION_ROUTER_PASS_RUN_32085260786','GEN307_NATIVE_PREFLIGHT_REQUESTED_PATH_UNRESOLVED_RUN_32085360964']),
  authorityScope:Object.freeze(['EXACT_PATH_RESOLUTION','TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION']),
  authorityLimitations:Object.freeze(['NO_PRODUCT_MUTATION','NO_CONSTRUCTION_AUTHORITY_CREATED_BY_REGISTRY','NO_SCOPE_EXPANSION_BEYOND_TWO_GEN307_TARGETS_AND_THIS_AMENDMENT','NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION']),
  parentRelations:Object.freeze([]),childRelations:Object.freeze([]),peerRelations:Object.freeze([]),upstreamBoundaries:Object.freeze([]),downstreamBoundaries:Object.freeze([]),
  cardinalRole:'NONE',cardinalStatus:'NONE',cardinalCompleteness:'NOT_APPLICABLE',
  orderingRules:Object.freeze(['GEN307_ADMISSION_AND_ROUTER_PASS_PRECEDE_THIS_SCOPE_REGISTRATION','NATIVE_PREFLIGHT_PASS_PRECEDES_ANY_GEN307_PRODUCT_MUTATION']),
  dependencyRelations:Object.freeze([]),allowedMutationScope:'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  prohibitedMutations:Object.freeze(['PRODUCT_MUTATION','CONSTRUCTION','MERGE','DEPLOYMENT','RELEASE']),
  requiredValidations:Object.freeze(['EXACT_TWO_TARGET_PATHS','TARGET_OCCURRENCES_TRUTHFULLY_ABSENT_AT_FROZEN_PUBLIC_BASE','PREDECESSOR_REGISTRY_PATHS_REMAIN_RESOLVED','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_PASS']),
  stoppingBoundaries:Object.freeze(['STOP_ON_PATH_OUTSIDE_EXACT_SCOPE','STOP_ON_PREDECESSOR_REGRESSION','STOP_BEFORE_PRODUCT_MUTATION_UNTIL_NATIVE_PREFLIGHT_PASS']),
  currentIdentityReferences:Object.freeze([FROZEN_PUBLIC_BASE,TOOLING_PREDECESSOR_HEAD,PRIVATE_GOVERNING_HEAD,'LOCK_GENERATION=307',OPERATION_ID]),unresolvedFields:Object.freeze([])
});

const pathIndex = new Map(H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_REGISTERED_PATHS.map((repositoryPath) => [repositoryPath, deepFreeze({nodes:Object.freeze([H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE]),occurrences:Object.freeze(OCCURRENCES.filter((entry)=>entry.path===repositoryPath))})]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({...baseInstance,evidenceRecords:[...(baseInstance.evidenceRecords??[]),H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_EVIDENCE],nodes:[...baseInstance.nodes.filter((node)=>node.nodeId!==NODE_ID),H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE]});

export function getHEarthRepositoryRegistryInstance(){return combinedInstance;}
export function getHEarthRepositoryRegistryNode(nodeId){return nodeId===NODE_ID?H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE:baseFacade.getHEarthRepositoryRegistryNode(nodeId);}
export function getHEarthRepositoryRegistryEvidence(evidenceId){return evidenceId===EVIDENCE_ID?H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_EVIDENCE:baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);}
export function resolveHEarthRepositoryRegistryPath(repositoryPath){const normalized=normalizePath(repositoryPath);const indexed=pathIndex.get(normalized);if(!indexed)return baseFacade.resolveHEarthRepositoryRegistryPath(normalized??repositoryPath);const base=baseFacade.resolveHEarthRepositoryRegistryPath(normalized);return deepFreeze({...base,repositoryPath:normalized,resolved:true,nodes:[...(base.nodes??[]),...indexed.nodes],occurrences:[...(base.occurrences??[]),...indexed.occurrences],unresolved:false});}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){const normalizedPath=input.path==null?null:normalizePath(input.path);const localMatches=OCCURRENCES.filter((entry)=>{if(normalizedPath!=null&&entry.path!==normalizedPath)return false;if(input.refType!=null&&entry.refType!==input.refType)return false;if(input.refName!=null&&entry.refName!==input.refName)return false;if(input.commitSha!=null&&entry.commitSha!==input.commitSha)return false;if(input.gitBlobSha!=null&&entry.gitBlobSha!==input.gitBlobSha)return false;if(input.existenceStatus!=null&&entry.existenceStatus!==input.existenceStatus)return false;return true;}).map((occurrence)=>deepFreeze({nodeId:NODE_ID,node:H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE,occurrence}));const base=baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input,...(normalizedPath==null?{}:{path:normalizedPath})});return deepFreeze({query:base.query,matches:[...(base.matches??[]),...localMatches],resolved:base.resolved===true||localMatches.length>0});}
export function findHEarthRepositoryRegistryNodes(criteria={}){const base=baseFacade.findHEarthRepositoryRegistryNodes(criteria);const node=H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE;const p=criteria.repositoryPath==null?null:normalizePath(criteria.repositoryPath);const matches=(p==null||node.repositoryPaths.includes(p))&&(criteria.nodeType==null||criteria.nodeType===node.nodeType)&&(criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&(criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&(criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus);return deepFreeze(matches?[...base,node]:base);}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH'){return nodeId===NODE_ID?Object.freeze([]):baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId){return nodeId===NODE_ID?deepFreeze({nodeId,nodes:[H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE],relations:[],unresolved:false}):baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);}

export function verifyHEarthGen307FinalExpressionPreflightScopeRegistration(){
  const pathChecks=H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_REGISTERED_PATHS.map((repositoryPath)=>{const expected=OCCURRENCES.find((entry)=>entry.path===repositoryPath);const resolution=resolveHEarthRepositoryRegistryPath(repositoryPath);const occurrence=(resolution.occurrences??[]).find((entry)=>entry.path===expected.path&&entry.commitSha===expected.commitSha&&entry.gitBlobSha===expected.gitBlobSha&&entry.existenceStatus===expected.existenceStatus);return deepFreeze({repositoryPath,resolved:resolution.resolved===true,occurrenceMatched:occurrence!=null,pass:resolution.resolved===true&&occurrence!=null});});
  const predecessorRun8E=baseFacade.resolveHEarthRepositoryRegistryPath('/showroom/globe/h-earth/render/run8e-successor-environment.js');
  const predecessorGen306Harness=baseFacade.resolveHEarthRepositoryRegistryPath('/h-earth-3d/validation/h-earth.world-manifold-architecture.harness.mjs');
  const checks=deepFreeze({exactTwoTargetPaths:H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_TARGET_PATHS.length===2,exactThreeRegisteredPathsIncludingSelf:H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_REGISTERED_PATHS.length===3,allRegisteredPathsResolve:pathChecks.every((entry)=>entry.pass),targetOccurrencesTruthfullyAbsent:targetOccurrences.every((entry)=>entry.existenceStatus==='ABSENT'&&entry.gitBlobSha===null),exactLockGeneration:LOCK_GENERATION===307,exactFrozenPublicBase:FROZEN_PUBLIC_BASE==='dbf2f3ec90faa59c09193e61a0d141481b68d758',exactPredecessorToolingHead:TOOLING_PREDECESSOR_HEAD==='46b2cca200f1db036cae8288329f870a8336505a',predecessorRun8EResolutionPreserved:predecessorRun8E.resolved===true,predecessorGen306HarnessResolutionPreserved:predecessorGen306Harness.resolved===true,noProductAuthority:H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION'),noConstructionAuthorityCreatedByRegistry:H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_NODE.authorityLimitations.includes('NO_CONSTRUCTION_AUTHORITY_CREATED_BY_REGISTRY')});
  const eligible=Object.values(checks).every(Boolean);return deepFreeze({eligible,status:eligible?'H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_REGISTRATION_PASS':'H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_REGISTRATION_FAIL',checks,pathChecks,issues:eligible?[]:Object.entries(checks).filter(([,pass])=>!pass).map(([name])=>name)});
}

export const repositoryRegistry=combinedInstance;
export const H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_FACADE=deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});
export default H_EARTH_GEN307_FINAL_EXPRESSION_PREFLIGHT_SCOPE_FACADE;
